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
    console.log("📌 [GET /api/curriculos] Iniciando consulta...");
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const nome = searchParams.get("nome");

    if (id) {
      console.log("🔎 [GET /api/curriculos] Buscando currículo por ID:", id);
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
      console.log("🔍 [GET /api/curriculos] Pesquisando por nome:", nome);
      curriculos = await pesquisarCurriculosPorNome(nome);
    } else {
      console.log("📋 [GET /api/curriculos] Listando todos os currículos");
      curriculos = await listarCurriculos();
    }

    console.log("✅ [GET /api/curriculos] Encontrados:", curriculos.length);
    return NextResponse.json({
      sucesso: true,
      total: curriculos.length,
      curriculos,
    });
  } catch (error) {
    console.error("❌ [GET /api/curriculos] Erro ao listar currículos:", error);
    return NextResponse.json(
      { erro: "Erro ao listar currículos", detalhes: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📌 [POST /api/curriculos] Iniciando cadastro...");
    
    const body: Curriculo = await request.json();
    console.log("📌 [POST /api/curriculos] Body recebido:", body);

    if (!body.fullName?.trim() || !body.jobTitle?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.summary?.trim()) {
      console.warn("⚠️ [POST /api/curriculos] Validação falhou - dados inválidos");
      return NextResponse.json(
        { erro: "Dados inválidos: nome, cargo, email, telefone e resumo são obrigatórios" },
        { status: 400 }
      );
    }

    console.log("✅ [POST /api/curriculos] Validações passaram.");
    
    const id = await cadastrarCurriculo(body);
    console.log("✅ [POST /api/curriculos] Currículo cadastrado com sucesso. ID:", id);

    return NextResponse.json(
      { sucesso: true, id, mensagem: "Currículo cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [POST /api/curriculos] Erro ao cadastrar currículo:", error);
    if (error instanceof Error) {
      console.error("❌ Erro Message:", error.message);
      console.error("❌ Erro Code:", (error as { code?: string }).code);
      console.error("❌ Stack trace:", error.stack);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        erro: "Erro ao cadastrar currículo", 
        detalhes: errorMessage,
        tipo: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("📌 [PUT /api/curriculos] Iniciando atualização...");
    
    const body = await request.json();
    const { id, ...curriculoData } = body;

    if (!id) {
      return NextResponse.json(
        { erro: "ID do currículo é obrigatório" },
        { status: 400 }
      );
    }

    console.log("📌 [PUT /api/curriculos] Atualizando currículo ID:", id);
    
    await atualizarCurriculo(id, curriculoData);
    console.log("✅ [PUT /api/curriculos] Currículo atualizado com sucesso.");

    return NextResponse.json(
      { sucesso: true, mensagem: "Currículo atualizado com sucesso" }
    );
  } catch (error) {
    console.error("❌ [PUT /api/curriculos] Erro ao atualizar currículo:", error);
    return NextResponse.json(
      { erro: "Erro ao atualizar currículo", detalhes: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("📌 [DELETE /api/curriculos] Iniciando exclusão...");
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { erro: "ID do currículo é obrigatório" },
        { status: 400 }
      );
    }

    console.log("📌 [DELETE /api/curriculos] Excluindo currículo ID:", id);
    
    await excluirCurriculo(id);
    console.log("✅ [DELETE /api/curriculos] Currículo excluído com sucesso.");

    return NextResponse.json(
      { sucesso: true, mensagem: "Currículo excluído com sucesso" }
    );
  } catch (error) {
    console.error("❌ [DELETE /api/curriculos] Erro ao excluir currículo:", error);
    return NextResponse.json(
      { erro: "Erro ao excluir currículo", detalhes: String(error) },
      { status: 500 }
    );
  }
}