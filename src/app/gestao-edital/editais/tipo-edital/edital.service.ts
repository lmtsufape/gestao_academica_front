import { generica } from '@/utils/api';
import type { TipoEditalFormData, Etapa, CampoPersonalizado } from '@/types/editalTypes';

export type TipoEditalPayload = {
  nome: string;
  descricao: string;
};

export type EtapaPayload = {
  nome: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  obrigatoria: boolean;
  ordem: number;
  tipoEditalModeloId: number;
  editalId?: number | null;
  statusAtualId?: number | null;
};

export type CampoPersonalizadoPayload = {
  nome: string;
  rotulo: string;
  obrigatorio: boolean;
  tipoCampo: string;
  opcoes?: string | null;
  tipoEditalModeloId?: number;
  etapaId?: number;
  editalId?: number | null;
};

// Payload para criar Documento
export type DocumentoPayload = {
  nome: string;
  caminho: string;
  etapaId: number;
};

function ensureOk(resp: any, errorMessage: string) {
  const ok = resp && typeof resp.status === 'number' && resp.status >= 200 && resp.status < 300;
  if (!ok) throw new Error(errorMessage);
}

export class EditalService {
  static async criarTipoEdital(payload: TipoEditalPayload): Promise<{ id: number; raw: any }> {
    const resp = await generica({ metodo: 'post', uri: '/editais/tipo-edital', data: payload });
    console.log('Resposta da criação do Tipo de Edital:', resp);
    ensureOk(resp, 'Falha ao criar Tipo de Edital');
    const id = resp.data.id;
    return { id, raw: resp.data ?? resp };
  }

  static async criarEtapa(payload: EtapaPayload): Promise<{ id: number; raw: any }> {
    const resp = await generica({ metodo: 'post', uri: '/editais/etapa', data: payload });
    ensureOk(resp, 'Falha ao criar Etapa');
    const id = resp.data.id;
    return { id, raw: resp.data ?? resp };
  }

  static async criarCampoPersonalizado(payload: CampoPersonalizadoPayload) {
    const resp = await generica({ metodo: 'post', uri: '/editais/campo-personalizado', data: payload });
    ensureOk(resp, 'Falha ao criar Campo Personalizado');
    return resp.data ?? resp;
  }

  static async criarDocumento(payload: DocumentoPayload) {
    const resp = await generica({ metodo: 'post', uri: '/editais/documento', data: payload });
    ensureOk(resp, 'Falha ao criar Documento');
    return resp.data ?? resp;
  }

  // lida com a criação do Tipo de Edital + Etapas + Campos + Documentos
  static async criarTipoEditalCompleto(formData: TipoEditalFormData) {
    // Cria o Tipo de Edital (modelo)
    const { id: tipoId } = await this.criarTipoEdital({
      nome: formData.nome,
      descricao: formData.descricao
    });

    // Cria campos gerais vinculados ao Tipo de Edital (em paralelo)
    const camposGerais = formData.campos ?? [];
    const criarCamposGeraisPromises = camposGerais.map((c: CampoPersonalizado) =>
      this.criarCampoPersonalizado({
        nome: c.nome,
        rotulo: c.rotulo,
        obrigatorio: !!c.obrigatorio,
        tipoCampo: c.tipoCampo as unknown as string,
        opcoes: c.opcoes ? JSON.stringify(c.opcoes) : null,
        tipoEditalModeloId: tipoId,
      })
    );

    // Para cada etapa, criar a etapa, seus campos e seus documentos
    const etapas = (formData.etapas ?? []) as Etapa[];

    const criarEtapasPromises = etapas.map(async (etapa, idx) => {
      const etapaResp = await this.criarEtapa({
        nome: etapa.nome,
        descricao: etapa.descricao,
        obrigatoria: !!etapa.obrigatoria,
        ordem: etapa.ordem ?? idx + 1,
        tipoEditalModeloId: tipoId,
      });
      const etapaId = etapaResp.id;

      // Campos da etapa (vinculados à etapa)
      const campos = (etapa.campos ?? []) as CampoPersonalizado[];
      await Promise.all(
        campos.map((c) =>
          this.criarCampoPersonalizado({
            nome: c.nome,
            rotulo: c.rotulo,
            obrigatorio: !!c.obrigatorio,
            tipoCampo: c.tipoCampo as unknown as string,
            opcoes: c.opcoes ? JSON.stringify(c.opcoes) : null,
            etapaId,
          })
        )
      );

      // Documentos da etapa (vinculados à etapa)
      const documentos = (etapa as any)?.documentos ?? [];
      if (Array.isArray(documentos) && documentos.length) {
        await Promise.all(
          documentos.map((d: any) =>
            this.criarDocumento({ nome: d.nome, caminho: d.caminho, etapaId })
          )
        );
      }

      return etapaId;
    });

    await Promise.all([Promise.all(criarCamposGeraisPromises), Promise.all(criarEtapasPromises)]);
    return { tipoEditalModeloId: tipoId };
  }

  static async atualizarTipoEdital(tipoEditalId: number, formData: TipoEditalPayload) {
    const resp = await generica({
      metodo: 'patch',
      uri: `/editais/tipo-edital/${tipoEditalId}`,
      data: {
        nome: formData.nome,
        descricao: formData.descricao
      }
    });
    ensureOk(resp, 'Falha ao atualizar Tipo de Edital');
    return resp.data ?? resp;
  }

  static async atualizarEtapaTipoEdital(etapaId: string, formData: Etapa) {
    const resp = await generica({
      metodo: 'patch',
      uri: `/editais/etapa/${etapaId}`,
      data: {
        nome: formData.nome,
        descricao: formData.descricao,
        obrigatoria: !!formData.obrigatoria,
        ordem: formData.ordem,
      }
    });
    ensureOk(resp, 'Falha ao atualizar Etapa');
    return resp.data ?? resp;
  }

  static async atualizarCampoPersonalizadoTipoEdital(campoId: number, formData: CampoPersonalizado) {
    const resp = await generica({
      metodo: 'patch',
      uri: `/editais/campo-personalizado/${campoId}`,
      data: {
        nome: formData.nome,
        rotulo: formData.rotulo,
        obrigatorio: !!formData.obrigatorio,
        tipoCampo: formData.tipoCampo as unknown as string,
        opcoes: formData.opcoes ? JSON.stringify(formData.opcoes) : null,
      }
    });
    ensureOk(resp, 'Falha ao atualizar Campo Personalizado');
    return resp.data ?? resp;
  }

  static async atualizarDocumentoTipoEdital(documentoId: string, formData: DocumentoPayload) {
    const resp = await generica({
      metodo: 'patch',
      uri: `/editais/documento/${documentoId}`,
      data: {
        nome: formData.nome,
        caminho: formData.caminho,
      }
    });
    ensureOk(resp, 'Falha ao atualizar Documento');
    return resp.data ?? resp;
  }

  static async removerEtapaTipoEdital(etapaId: number) {
    const resp = await generica({ metodo: 'delete', uri: `/editais/etapa/${etapaId}` });
    ensureOk(resp, 'Falha ao remover Etapa');
    return resp.data ?? resp;
  }

  static async removerCampoPersonalizadoTipoEdital(campoId: number) {
    const resp = await generica({ metodo: 'delete', uri: `/editais/campo-personalizado/${campoId}` });
    ensureOk(resp, 'Falha ao remover Campo Personalizado');
    return resp.data ?? resp;
  }

  static async atualizarTipoEditalCompleto(tipoEditalId: number, formData: TipoEditalFormData, etapasParaRemover?: number[], camposParaRemover?: number[]) {
    if (etapasParaRemover && etapasParaRemover.length) {
      await Promise.all(etapasParaRemover.map((etapaId) => this.removerEtapaTipoEdital(etapaId)));
    }

    if (camposParaRemover && camposParaRemover.length) {
      await Promise.all(camposParaRemover.map((campoId) => this.removerCampoPersonalizadoTipoEdital(campoId)));
    }

    // Atualiza o Tipo de Edital (modelo)
    await this.atualizarTipoEdital(tipoEditalId, {
      nome: formData.nome,
      descricao: formData.descricao
    });

    // Atualiza campos gerais vinculados ao Tipo de Edital
    const camposGerais = formData.campos ?? [];
    const atualizarCamposGeraisPromises = camposGerais.map((c: CampoPersonalizado) => {
      if (c.campoId) {
        return this.atualizarCampoPersonalizadoTipoEdital(c.campoId, c);
      } else {
        // Se o campo não tem ID, cria um novo campo vinculado ao Tipo de Edital
        return this.criarCampoPersonalizado({
          nome: c.nome,
          rotulo: c.rotulo,
          obrigatorio: !!c.obrigatorio,
          tipoCampo: c.tipoCampo as unknown as string,
          opcoes: c.opcoes ? JSON.stringify(c.opcoes) : null,
          tipoEditalModeloId: tipoEditalId,
        });
      }
    });

    // Para cada etapa, atualizar a etapa
    const etapas = (formData.etapas ?? []) as Etapa[];
    const atualizarEtapasPromises = etapas.map(async (etapa, idx) => {
      let etapaId = etapa.etapaId;
      if (etapaId) {
        await this.atualizarEtapaTipoEdital(etapaId.toString(), etapa);
      } else {
        // Se a etapa não tem ID, cria uma nova etapa vinculada ao Tipo de Edital
        const etapaResp = await this.criarEtapa({
          nome: etapa.nome,
          descricao: etapa.descricao,
          obrigatoria: etapa.obrigatoria,
          ordem: etapa.ordem ?? idx + 1,
          tipoEditalModeloId: tipoEditalId,
        });
        etapaId = etapaResp.id;
      }

      // Campos da etapa (vinculados à etapa)
      const campos = (etapa.campos ?? []) as CampoPersonalizado[];
      await Promise.all(
        campos.map((c) => {
          if (c.campoId) {
            return this.atualizarCampoPersonalizadoTipoEdital(c.campoId, c);
          } else {
            return this.criarCampoPersonalizado({
              nome: c.nome,
              rotulo: c.rotulo,
              obrigatorio: !!c.obrigatorio,
              tipoCampo: c.tipoCampo,
              opcoes: c.opcoes ? JSON.stringify(c.opcoes) : null,
              etapaId,
            });
          }
        })
      );
    });

    await Promise.all([Promise.all(atualizarCamposGeraisPromises), Promise.all(atualizarEtapasPromises)]);
    return { tipoEditalModeloId: tipoEditalId };
  }
}