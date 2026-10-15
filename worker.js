
export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "https://novin062m-source.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ status: "VEXYRA online" }),
        { headers }
      );
    }

    try {
      if (!env.GROQ_API_KEY) {
        throw new Error("Chave Groq não configurada");
      }

      const body = await request.json();
      const mensagem = String(body.mensagem || "").trim().slice(0, 2000);

      if (!mensagem) {
        return new Response(
          JSON.stringify({ erro: "Mensagem vazia" }),
          { status: 400, headers }
        );
      }

      const resposta = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: "Você é VEXYRA, uma inteligência artificial amigável, inteligente e natural. Responda em português brasileiro."
              },
              {
                role: "user",
                content: mensagem
              }
            ],
            max_tokens: 500
          })
        }
      );

      const dados = await resposta.json();

      return new Response(
        JSON.stringify({
          resposta: dados.choices?.[0]?.message?.content ||
            dados.error?.message ||
            "Não consegui responder."
        }),
        {
          status: resposta.ok ? 200 : 502,
          headers
        }
      );

    } catch (erro) {
      return new Response(
        JSON.stringify({
          erro: "Falha ao processar mensagem."
        }),
        { status: 500, headers }
      );
    }
  }
};
          
