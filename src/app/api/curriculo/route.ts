import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  atualizarCurriculo,
  buscarCurriculoPorId,
  cadastrarCurriculo,
  Curriculo,
  excluirCurriculo,
  listarCurriculos,
  pesquisarCurriculosPorNome,
} from '@/lib/CurriculoService';

export async function GET(request: NextRequest) {
  try {
    console.log("📌 [GET /api/curriculo] Iniciando consulta...");
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const nome = searchParams.get("nome");

    if (id) {
      console.log("🔎 [GET /api/curriculo] Buscando currículo por ID:", id);
      const curriculo = await buscarCurriculoPorId(id);
      if (!curriculo) {
        return NextResponse.json(
          { erro: "Currículo não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({ sucesso: true, curriculo });
    }

    let curriculos;

    if (nome) {
      console.log("🔍 [GET /api/curriculo] Pesquisando por nome:", nome);
      curriculos = await pesquisarCurriculosPorNome(nome);
    } else {
      console.log("📋 [GET /api/curriculo] Listando todos os currículos");
      curriculos = await listarCurriculos();
    }

    console.log("✅ [GET /api/curriculo] Encontrados:", curriculos.length);
    return NextResponse.json({
      sucesso: true,
      total: curriculos.length,
      curriculos,
    });
  } catch (error) {
    console.error("❌ [GET /api/curriculo] Erro ao listar currículos:", error);
    return NextResponse.json(
      { erro: "Erro ao listar currículos", detalhes: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📌 [POST /api/curriculo] Iniciando cadastro...");
    
    // Validar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.warn("⚠️ [POST /api/curriculo] Content-Type inválido:", contentType);
      return NextResponse.json(
        { erro: "Content-Type deve ser application/json" },
        { status: 415 }
      );
    }

    let body: Curriculo;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ [POST /api/curriculo] Erro ao fazer parse do JSON:", parseError);
      return NextResponse.json(
        { erro: "JSON inválido no corpo da requisição" },
        { status: 400 }
      );
    }

    console.log("📌 [POST /api/curriculo] Body recebido:", body);

    // Validação de campos obrigatórios
    const camposObrigatorios = {
      fullName: body.fullName?.trim(),
      cpf: body.cpf?.trim(),
      jobTitle: body.jobTitle?.trim(),
      email: body.email?.trim(),
      phone: body.phone?.trim(),
      summary: body.summary?.trim(),
    };

    const camposVazios = Object.entries(camposObrigatorios)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposVazios.length > 0) {
      console.warn("⚠️ [POST /api/curriculo] Validação falhou - campos vazios:", camposVazios);
      return NextResponse.json(
        { 
          erro: "Dados inválidos: campos obrigatórios vazios",
          camposVazios 
        },
        { status: 400 }
      );
    }

    console.log("✅ [POST /api/curriculo] Validações passaram.");
    
    try {
      const id = await cadastrarCurriculo(body);
      console.log("✅ [POST /api/curriculo] Currículo cadastrado com sucesso. ID:", id);

      return NextResponse.json(
        { sucesso: true, id, mensagem: "Currículo cadastrado com sucesso" },
        { status: 201 }
      );
    } catch (firebaseError) {
      console.error("❌ [POST /api/curriculo] Erro do Firebase:", firebaseError);
      
      if (firebaseError instanceof Error) {
        const errorMessage = firebaseError.message;
        
        // Erros comuns do Firebase
        if (errorMessage.includes('permission-denied')) {
          return NextResponse.json(
            { 
              erro: "Permissão negada. Verifique as regras de segurança do Firestore.",
              detalhes: "Você não tem permissão para escrever neste documento."
            },
            { status: 403 }
          );
        }
        
        if (errorMessage.includes('authentication-required')) {
          return NextResponse.json(
            { 
              erro: "Autenticação necessária. Por favor, faça login.",
              detalhes: errorMessage
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { 
            erro: "Erro ao cadastrar currículo no Firestore",
            detalhes: errorMessage,
            tipo: firebaseError.name
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          erro: "Erro desconhecido ao cadastrar currículo",
          detalhes: String(firebaseError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ [POST /api/curriculo] Erro geral:", error);
    return NextResponse.json(
      { 
        erro: "Erro ao cadastrar currículo", 
        detalhes: error instanceof Error ? error.message : String(error),
        tipo: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("📌 [PUT /api/curriculo] Iniciando atualização...");
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { erro: "ID do currículo é obrigatório" },
        { status: 400 }
      );
    }

    const body = await request.json();

    console.log("📌 [PUT /api/curriculo] Atualizando currículo ID:", id);
    
    await atualizarCurriculo(id, body);
    console.log("✅ [PUT /api/curriculo] Currículo atualizado com sucesso.");

    return NextResponse.json(
      { sucesso: true, mensagem: "Currículo atualizado com sucesso" }
    );
  } catch (error) {
    console.error("❌ [PUT /api/curriculo] Erro ao atualizar currículo:", error);
    return NextResponse.json(
      { erro: "Erro ao atualizar currículo", detalhes: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("📌 [DELETE /api/curriculo] Iniciando exclusão...");
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { erro: "ID do currículo é obrigatório" },
        { status: 400 }
      );
    }

    console.log("📌 [DELETE /api/curriculo] Excluindo currículo ID:", id);
    
    await excluirCurriculo(id);
    console.log("✅ [DELETE /api/curriculo] Currículo excluído com sucesso.");

    return NextResponse.json(
      { sucesso: true, mensagem: "Currículo excluído com sucesso" }
    );
  } catch (error) {
    console.error("❌ [DELETE /api/curriculo] Erro ao excluir currículo:", error);
    return NextResponse.json(
      { erro: "Erro ao excluir currículo", detalhes: String(error) },
      { status: 500 }
    );
  }
}