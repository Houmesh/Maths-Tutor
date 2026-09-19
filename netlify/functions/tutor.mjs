export default async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: 'OPENAI_API_KEY not configured' }, { status: 503 });

  try {
    const body = await request.json();
    const recent = Array.isArray(body.recent) ? body.recent.slice(-10) : [];
    const history = recent.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${String(m.text || '').slice(0,1200)}`).join('\n');
    const performance = Array.isArray(body.performance) ? body.performance.slice(0,15).map(p => `${p.chapter}: ${p.mastery}%`).join('; ') : 'No data yet';
    const instructions = `You are a warm, rigorous CBSE Class 7 mathematics tutor for a child studying the 2026-27 NCERT Ganita Prakash course.\n\nTeaching rules:\n- Use age-appropriate language and short turns.\n- Socratic first: do not immediately give a homework answer. Ask what the student understands, give one hint, then another if needed.\n- Explain reasoning, not just procedures.\n- For calculations, verify arithmetic carefully.\n- If the student makes a mistake, identify the misconception without shaming.\n- End most teaching replies with one small check-for-understanding question.\n- Stay within Class 7 maths unless a brief prerequisite explanation is needed.\n- Never claim to have seen homework or a textbook page that was not provided.\n- Language preference: ${body.language || 'English'}. For Hinglish, use simple natural Hinglish while keeping standard mathematical terms in English.\n- Current chapter: ${body.chapter || 'General revision'}.\n- Student name: ${body.studentName || 'Student'}.\n- Recent mastery: ${performance}.\n- Keep replies usually under 180 words.`;

    const input = `${history ? `Recent conversation:\n${history}\n\n` : ''}Student's new message: ${String(body.message || '').slice(0,3000)}`;
    const apiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        instructions,
        input,
        max_output_tokens: 450
      })
    });
    const data = await apiRes.json();
    if (!apiRes.ok) return Response.json({ error: data?.error?.message || 'OpenAI request failed' }, { status: 502 });

    let reply = data.output_text;
    if (!reply && Array.isArray(data.output)) {
      reply = data.output.flatMap(item => Array.isArray(item.content) ? item.content : []).map(c => c.text || '').filter(Boolean).join('\n');
    }
    if (!reply) throw new Error('No tutor text returned');
    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: err.message || 'Tutor error' }, { status: 500 });
  }
};
