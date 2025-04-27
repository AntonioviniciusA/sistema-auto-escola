import React, { useEffect, useState } from "react";
import { FaFileDownload, FaSave, FaEdit,FaExclamationTriangle  } from "react-icons/fa";
import "./ContractGenerator.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  PDFViewer, 
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
    borderColor: "#000",
  },
  tableH1: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableH2: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000",
  },

  tableC: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderTop: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    marginTop: -20,
    borderColor: "#000",
  },

  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    borderColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  paymentSeparator: {
    backgroundColor: "#d0d0d0",
  },
  paymentRow: {
    backgroundColor: "#f0f0f0",
  },
  clausula: {
    marginBottom: 8,
    textAlign: "justify",
  },
  espacoMedio: {
    height: 10,
  },
});

function GerarContrato({ aluno, id }) {
  const [contrato, setContrato] = useState({
    dataContrato: "",
    valor: "",
    descricao: "",
    validadeProcesso: "",
    dataInicioProcesso: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContrato((prev) => ({ ...prev, [name]: value }));

    if (name === "dataInicioProcesso") {
      const startDate = new Date(value);
      const validadeDate = new Date(
        startDate.setFullYear(startDate.getFullYear() + 1)
      );
      setContrato((prev) => ({
        ...prev,
        validadeProcesso: validadeDate.toISOString().split("T")[0],
      }));
    }
  };

  const hj = new Date();
  const dataFormatada = hj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `https://sistemaautoescola.onrender.com/api/pagamentos/aluno/${id}`
        );
        const total = response.data
          .flat()
          .reduce((soma, item) => soma + item.valor, 0);
        setContrato((prev) => ({ ...prev, valor: total }));
      } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
        toast.error("Erro ao carregar dados de pagamento");
      }
    };
    fetchPayments();
  }, [id]);

  const formatCurrency = (value) => {
    const num = parseFloat(value || 0);
    return num
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const getValorPorExtenso = (valor) => {
    valor = Math.floor(Number(valor)) || 0;
    const unidades = [
      "zero",
      "um",
      "dois",
      "três",
      "quatro",
      "cinco",
      "seis",
      "sete",
      "oito",
      "nove",
    ];
    const dezAteVinte = [
      "dez",
      "onze",
      "doze",
      "treze",
      "quatorze",
      "quinze",
      "dezesseis",
      "dezessete",
      "dezoito",
      "dezenove",
    ];
    const dezenas = [
      "vinte",
      "trinta",
      "quarenta",
      "cinquenta",
      "sessenta",
      "setenta",
      "oitenta",
      "noventa",
    ];
    const centenas = [
      "cem",
      "duzentos",
      "trezentos",
      "quatrocentos",
      "quinhentos",
      "seiscentos",
      "setecentos",
      "oitocentos",
      "novecentos",
    ];

    if (valor < 10) return unidades[valor];
    if (valor < 20) return dezAteVinte[valor - 10];
    if (valor < 100) {
      const dezena = Math.floor(valor / 10);
      const resto = valor % 10;
      return dezenas[dezena - 2] + (resto !== 0 ? " e " + unidades[resto] : "");
    }
    if (valor < 1000) {
      const centena = Math.floor(valor / 100);
      const resto = valor % 100;
      return (
        centenas[centena - 1] +
        (resto !== 0 ? " e " + getValorPorExtenso(resto) : "")
      );
    }
    return "valor alto";
  };

  const getTabelaServicos = (categoria) => {
    switch (categoria) {
      case "A":
        return [
          ["001", "AULAS CAT A", "15", "120,00", "1.800,00", 'AULA "A"'],
          ["002", "VIATURA P/ EXAME", "01", "480,00", "480,00", 'EXAME "A"'],
          [
            "003",
            "BIOMETRIA PRATICA MOTO",
            "01",
            "312,00",
            "312,00",
            "BIOMETRIA",
          ],
        ];
      case "B":
        return [
          ["001", "AULAS PRÁTICA CARRO", "20", "50,00", "780,00", 'AULA "B"'],
          ["002", "AULAS TEÓRICAS", "09", "450,00", "450,00", "AULA TEÓRICA"],
          ["003", "VIATURA P/ EXAME", "02", "480,00", "960,00", "EXAME"],
          [
            "004",
            "BIOMETRIA PRATICA CARRO",
            "01",
            "390,00",
            "390,00",
            "BIOMETRIA",
          ],
        ];
      case "D":
        return [
          ["001", "AULAS CAT D", "15", "100,00", "1.500,00", 'AULA "D"'],
          ["002", "VIATURA P/ EXAME", "01", "480,00", "480,00", 'EXAME "D"'],
          [
            "003",
            "BIOMETRIA PRATICA CARRO",
            "01",
            "312,00",
            "312,00",
            "BIOMETRIA",
          ],
        ];
      case "E":
        return [
          ["001", "AULAS CAT E", "15", "120,00", "1.500,00", 'AULA "E"'],
          ["002", "VIATURA P/ EXAME", "01", "480,00", "480,00", 'EXAME "E"'],
          [
            "003",
            "BIOMETRIA PRATICA CARRO",
            "01",
            "312,00",
            "312,00",
            "BIOMETRIA",
          ],
        ];
      case "AB":
        return [
          ["001", "AULAS PRÁTICA CARRO", "20", "50,00", "659,00", 'AULA "B"'],
          ["002", "AULAS PRÁTICAS MOTO", "20", "25,00", "300,00", 'AULA "A"'],
          ["003", "AULAS TEÓRICAS", "09", "450,00", "450,00", "AULA TEÓRICA"],
          ["004", "VIATURA P/EXAME", "02", "530,00", "480,00", "EXAME"],
          [
            "005",
            "BIOMETRIA PRATICA CARRO",
            "01",
            "390,00",
            "390,00",
            "BIOMETRIA",
          ],
          [
            "006",
            "BIOMETRIA PRATICA MOTO",
            "01",
            "221,00",
            "221,00",
            "BIOMETRIA",
          ],
        ];
      default:
        return [
          [
            "001",
            `AULAS CAT ${categoria}`,
            "15",
            "120,00",
            "1.800,00",
            `AULA "${categoria}"`,
          ],
          [
            "002",
            "VIATURA P/ EXAME",
            "1",
            "480,00",
            "480,00",
            `EXAME "${categoria}"`,
          ],
        ];
    }
  };

  const getTabelaServicosFuturos = (categoria) => {
    switch (categoria) {
      case "B":
        return [
          ["001", "AULAS CAT B", "50,00", ""],
          ["002", "VIATURA P/ EXAME", "480,00", ""],
        ];

      case "D":
        return [
          ["001", "AULAS CAT D", "100,00", ""],
          ["002", "VIATURA P/ EXAME", "480,00", ""],
        ];

      case "E":
        return [
          ["001", "AULAS CAT E", "100,00", ""],
          ["002", "VIATURA P/ EXAME", "480,00", ""],
        ];

      case "AB":
        return [
          ["001", "AULAS CAT B", "50,00", ""],
          ["002", "AULAS CAT A", "25,00", ""],
          ["003", "VIATURA P/ EXAME", "530,00", ""],
        ];

      default:
        return [["001", "Dados não encontrados", "0,00", ""]];
    }
  };
  const getObjetivoContrato = (categoria) => {
    const categoriaUpper = categoria.toUpperCase();

    if (["AB", "B", "A"].includes(categoriaUpper)) {
      return `Curso teórico e prático categoria ${categoriaUpper}`;
    } else {
      return `Curso técnico categoria ${categoriaUpper}`;
    }
  };

  const ContratoPDF = () => {
    const valorTotal = parseFloat(contrato.valor) || 0;
    const valorExtenso =
      getValorPorExtenso(valorTotal).toUpperCase() + " REAIS";
    const tabelaServicos = getTabelaServicos(aluno.tipoCarteira);
    const tabelaServicosFuturos = getTabelaServicosFuturos(aluno.tipoCarteira);

    return (
      <Document>
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text>CENTRO DE FORMAÇÃO DE CONDUTORES B RADAR</Text>
            <Text>CNPJ/MF: 026450021/0001-90</Text>
            <Text>QN312 CONJUNTO-01 LOTE-04 SALA-103</Text>
            <Text>SAMAMBAIA SUL</Text>
            <Text>FONE: 3358-3307</Text>
            <Text>EMAIL: AUTOESCOLARADAR1@GMAIL.COM</Text>
            <Text>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
          </View>

          <View style={styles.tableH1}>
            <Text>NOME: {aluno.nome}</Text>
            <Text>CPF: {aluno.cpf}</Text>
            <Text>RG: {aluno.rg}</Text>
            <Text>TELEFONE: {aluno.telefone}</Text>
            <Text>ENDEREÇO: {aluno.endereco}</Text>
            <View style={styles.tableH2}>
              <Text>
                VALOR TOTAL DO CONTRATO R$: R${formatCurrency(valorTotal)} (
                {valorExtenso})
              </Text>
              <Text>
                OBJETIVO DO CONTRATO: {getObjetivoContrato(aluno.tipoCarteira)}
              </Text>
              <Text>
                VALIDADE DO PROCESSO:{" "}
                {contrato.validadeProcesso || "XX/XX/XXXX"}
              </Text>
              <Text>
                DATA DE INÍCIO DO PROCESSO:{" "}
                {contrato.dataInicioProcesso || "XX/XX/XXXX"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View style={[styles.tableRow, { backgroundColor: "#d0d0d0" }]}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "100%", textAlign: "center" },
                  ]}
                  colSpan={6}
                >
                  <Text style={[styles.bold, { fontSize: 12 }]}>
                    COMPOSIÇÃO DO CONTRATO
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.tableRow,
                  styles.tableHeader,
                  { backgroundColor: "#f0f0f0" },
                ]}
              >
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text>Item</Text>
                </View>
                <View style={[styles.tableCol, { width: "30%" }]}>
                  <Text>Descrição</Text>
                </View>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text>Qtd.</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text>Unit. R$</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text>Total R$</Text>
                </View>
                <View style={[styles.tableCol, { width: "20%" }]}>
                  <Text>Obs</Text>
                </View>
              </View>

              {tabelaServicos.map((row, i) => (
                <View
                  style={[styles.tableRow, i % 2 === 0 ? styles.evenRow : {}]}
                  key={`comp-${i}`}
                >
                  {row.map((cell, j) => (
                    <View
                      style={[
                        styles.tableCol,
                        {
                          width:
                            j === 0
                              ? "10%"
                              : j === 1
                              ? "30%"
                              : j === 2
                              ? "10%"
                              : j === 3
                              ? "15%"
                              : j === 4
                              ? "15%"
                              : "20%",
                          textAlign:
                            j === 2 || j === 3 || j === 4 ? "center" : "left",
                        },
                      ]}
                      key={`comp-cell-${i}-${j}`}
                    >
                      <Text>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View style={[styles.table, { marginTop: -11 }]}>
              <View style={[styles.tableRow, { backgroundColor: "#d0d0d0" }]}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "100%", textAlign: "center" },
                  ]}
                  colSpan={4}
                >
                  <Text style={[styles.bold, { fontSize: 12 }]}>
                    TABELA DE SERVIÇOS FUTUROS E FORMA DE PAGAMENTO
                    {aluno.tipoCarteira === "AB" ? " (CATEGORIA AB)" : ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text>Item</Text>
                </View>
                <View style={[styles.tableCol, { width: "40%" }]}>
                  <Text>Descrição</Text>
                </View>
                <View style={[styles.tableCol, { width: "20%" }]}>
                  <Text>Valor R$</Text>
                </View>
                <View style={[styles.tableCol, { width: "30%" }]}>
                  <Text>Aplicação</Text>
                </View>
              </View>

              {tabelaServicosFuturos.map((row, i) => (
                <View
                  style={[styles.tableRow, i % 2 === 0 ? styles.evenRow : {}]}
                  key={`futuro-${i}`}
                >
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text>{row[0]}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "40%" }]}>
                    <Text>{row[1]}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCol,
                      { width: "20%", textAlign: "center" },
                    ]}
                  >
                    <Text>{row[2]}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "30%" }]}>
                    <Text>{row[3]}</Text>
                  </View>
                </View>
              ))}

              <View style={[styles.tableRow, styles.paymentSeparator]}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "100%", textAlign: "center" },
                  ]}
                  colSpan={4}
                >
                  <Text style={[styles.bold, { fontSize: 11 }]}>
                    FORMA DE PAGAMENTO
                  </Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.paymentRow]}>
                <View
                  style={[styles.tableCol, { width: "50%", textAlign: "left" }]}
                >
                  <Text>DINHEIRO</Text>
                </View>
                <View
                  style={[styles.tableCol, { width: "50%", textAlign: "left" }]}
                >
                  <Text>R${formatCurrency(valorTotal)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tableC}>
            <Text> </Text>
            <Text style={styles.bold}>Cláusulas e condições</Text>
            <Text>
              01 – A CONTRATADA providenciará junto ao DETRAN serviços de
              interesse da CONTRATANTE e ministrará aulas práticas até o
              estipulado acima com duração de 50 (cinquenta) minutos cabendo à
              CONTRATADA compromete-se ainda a disponibilizar instrutor
              credenciado pelo DETRAN, veículo automotor na(s) categoria(s)
              acima descrita(s) bem como SEDE REGULAMENTADA em horário comercial
              (segunda a sexta de 08:00hs às 18:00hs) para soluções de problemas
              oriundos da prestação dos serviços.
            </Text>
            <Text> </Text>
            <Text>
              02 – Em contraprestação às obrigações assumidas pela CONTRATADA,
              pagará a CONTRATADA, o valor do presente contrato nas condições e
              valores ora acertados representados por moeda corrente NACIONAL,
              CHEQUE ou NOTA PROMISSORIA, a vista ou parcelado.
            </Text>
            <Text> </Text>
            <Text>
              03 – O atraso no pagamento de 01 (uma) prestação, importará na
              suspensão automática do curso sendo acrescida às prestações
              vencidas MULTA DE 5% (CINCO POR CENTO) e juros de 2% (DOIS POR
              CENTO) ao mês. Matrícula efetuada na promissória, a marcação de
              prova prática final somente com o CONTRATANTE quitado com todas as
              dívidas com à CONTRATADA.
            </Text>
            <Text> </Text>
            <Text>
              04 – O prazo de validade deste CONTRATO é por tempo indeterminado
              e pode ser rescindido por iniciativa da CONTRATATE quitando
              prestações vencidas. A CONTRATADA ressarcirá ao aluno apenas
              serviços ainda não prestados subtraindo deste 30% (TRINTA POR
              CENTO) do VALOR TOTAL DOS SERVIÇOS CONTRATADOS a título da multa
              rescisória.
            </Text>
            <Text> </Text>
            <Text>
              05 – Em caso de RESCISÃO DE CONTRATO e consequente devolução de
              valores, fica desde já, estabelecido que somente poderá ser
              realizado através de depósito ou transferência bancária. Devendo a
              conta estar em nome da CONTRATANTE num prazo de 5 (CINCO) dias
              úteis a contar da data de assinatura do TERMO DE RESCISÃO.
            </Text>
            <Text> </Text>
            <Text>
              06 – O prazo para prestação dos serviços ora contratado é de 90
              (NOVENTA) dias a contar da data de assinatura. Findo este prazo
              estará a CONTRATADA desobrigada a cumprir com as obrigações
              assumidas sem prejuízo de seus créditos.
            </Text>
            <Text> </Text>
            <Text>
              07 – É de responsabilidade da CONTRATANTE observar a validade do
              processo composto por exames médicos e curso teórico. Expirada da
              validada do processo poderá a CONTRATANTE rescindir o contrato
              observando o disposto da cláusula 04.
            </Text>
            <Text> </Text>
            <Text>
              08 – As aulas práticas somente serão marcadas pessoalmente e em
              horários disponíveis no veículo escolhido pela CONTRATANTE no
              limite de 3 (três) aulas por dia.
            </Text>
            <Text> </Text>
            <Text>
              09 – Marcação de EXAME DE DIREÇÃO somente será realizado quando:
            </Text>
            <Text
              style={[styles.section, { marginBottom: 0 }, { marginLeft: 120 }]}
            >
              Após um mínimo de 20 (vinte) aulas;
            </Text>
            <Text
              style={[styles.section, { marginBottom: 0 }, { marginLeft: 120 }]}
            >
              A CONTRATANTE não possuir débitos acumulados;
            </Text>
            <Text style={[styles.section, { marginLeft: 120 }]}>
              A CONTRATANTE quitar as promissórias/duplicatas em aberta.
            </Text>

            <Text>
              10 – Em caso de reprovação no EXAME PRÁTICO, deverá a CONTRATANTE
              adquirir um mínimo de 5 (CINCO) aulas que serão ministradas antes
              do reteste bem como pagar taxa de acordo com a tabela de serviços
              do DETRAN somando aos itens descritos como VIATURA PARA EXAME e
              EMISSÃO DE BORDERÔ RETESTE na tabela de serviços futuros.
            </Text>
            <Text> </Text>
            <Text>
              11 – Poderá a CONTRATADA aplicar cobrança de quaisquer dos itens
              descritos na tabela de serviços futuros quando satisfeita a
              condição descrita no campo ‘APLICAÇÃO’ do item na referida tabela.
              Em caso de desmarcação o valor ficará acumulado devendo a
              CONTRATANTE quitar o valor em débito antes da marcação do exame.
            </Text>
            <Text> </Text>
            <Text>
              12 – Em caso de suspeita e consequente comprovação do uso de
              substâncias alcoólicas e ou entorpecente durante as aulas práticas
              por parte da CONTRATANTE, a mesma será encaminhada ao DETRAN,
              podendo ser suspensa ou submetida a uma nova avaliação médica.
            </Text>
            <Text> </Text>
            <Text>
              13 – Não serão permitidos trajes inadequados ou uso de sonoros
              durante período das AULAS bem como no EXAME sendo obrigatório uso
              de sapato fechado sob pena de suspensão devendo o CONTRATANTE
              adquirir outra AULA ou EXAME para cumprimento de carga horária.
            </Text>
            <Text> </Text>
            <Text>
              14 – É obrigatório porte de documento de identificação com foto em
              perfeitas condições e LADV ORIGINAL emitida pelo DETRAN bem como
              ÓCULOS quando for o caso sob pena de suspensão de aula a qual será
              considerada faltosa devendo a CONTRATANTE adquirir outra aula para
              cumprimento da carga horária.
            </Text>
            <Text> </Text>
            <Text>
              15 – A CONTRATADA não se responsabiliza por objetos deixados no
              interior dos veículos.
            </Text>
            <Text> </Text>
            <Text>
              16 – Estarão consideradas satisfeitas pela CONTRATADA todas as
              obrigações colocadas à disposição da CONTRATANTE quando esta não
              comparecer.
            </Text>
          </View>

          <View style={[styles.section, { marginTop: 20 }]}>
            <Text>
              E por estarem justos e contratados, assinam o presente CONTRATO.
            </Text>
            <Text>SAMAMBAIA SUL –DF, {dataFormatada}.</Text>
            <Text>CENTRO DE FORMAÇÃO DE CONDUTORES B RADAR</Text>
          </View>

          {/*Espaçamento*/}
          <Text> </Text>
          <Text> </Text>

          <View style={[styles.section, { textAlign: "center" }]}>
            <Text>__________________________ ___________________________</Text>
            <Text>
              {" "}
              <> </>CONTRATADA CONTRATANTE
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

  const EditarAluno = () => {
    setIsEditing(true);
    toast.success(
      "Modo edição ativado! Possível alterar apenas Dados do Contrato!."
    );
  };

  const SalvarAluno = async (e) => {
    e.preventDefault();
    try {
      setIsEditing(false);
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar alterações");
    }
  };

  const [showPdfViewer, setShowPdfViewer] = useState(false);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-bg-contract">
        <h2>Dados do Aluno:</h2>
        <div className="info-grid-contract" id="no-print">
          <div className="card-data">
            <label htmlFor="nome" className="input-title">
              Nome:
            </label>
            <input
              className="input-border"
              id="nome"
              type="text"
              name="nome"
              value={aluno.nome}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="cpf" className="input-title">
              CPF:
            </label>
            <input
              className="input-border"
              id="cpf"
              type="text"
              name="cpf"
              value={aluno.cpf}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="rg" className="input-title">
              RG:
            </label>
            <input
              className="input-border"
              id="rg"
              type="text"
              name="rg"
              value={aluno.rg}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="telefone" className="input-title">
              Telefone:
            </label>
            <input
              className="input-border"
              id="telefone"
              type="text"
              name="telefone"
              value={aluno.telefone}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="endereco" className="input-title">
              Endereço:
            </label>
            <input
              className="input-border"
              id="endereco"
              type="text"
              name="endereco"
              value={aluno.endereco}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="card-data">
            <label htmlFor="dataNascimento" className="input-title">
              Data Nascimento:
            </label>
            <input
              className="input-border"
              type="text"
              value={new Date(aluno.dataNascimento).toLocaleDateString()}
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="tipoCarteira" className="input-title">
              Tipo de Carteira:
            </label>
            <input
              className="input-border"
              id="tipoCarteira"
              type="text"
              value={aluno.tipoCarteira}
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="instrutorNome" className="input-title">
              Instrutor:
            </label>
            <input
              className="input-border"
              id="instrutorNome"
              type="text"
              name="instrutorNome"
              value={aluno.instrutorNome}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="ctn-header">
          <h2>Dados do Contrato:</h2>
          <button 
          onClick={() => setShowPdfViewer(true)}
          className="btn-generate"
          >
          <FaFileDownload className="icone" size={20} /> Visualizar Contrato
          </button>

        {showPdfViewer && (
         <div className="pdf-viewer-modal">
          <div className="pdf-viewer-header">
           <h3>Contrato: {aluno.nome} - Categoria {aluno.tipoCarteira}</h3>
           <button onClick={() => setShowPdfViewer(false)} className="close-button">
            &times;
           </button>
          </div>
          <PDFViewer className="pdf-viewer-content">
           <ContratoPDF />
          </PDFViewer>
         </div>
        )}
        </div>
        <div className="btn-ctn">
          {isEditing ? (
            <button onClick={SalvarAluno} className="size-buttons btn-save">
              <FaSave className="icone" size={20} />
            </button>
          ) : (
            <button onClick={EditarAluno} className="btn-editer size-buttons">
              <FaEdit className="icone" size={20} />
            </button>
          )}
          <button className="btn-warning-print">
            <FaExclamationTriangle size={18} className="piscar" />
            Impressão Indisponivel
          </button>
        </div>

        <div className="info-grid-contract2">
          <div className="card-data">
            <label htmlFor="valorContrato" className="input-title">
              Valor Total:
            </label>
            <input
              className="input-border"
              id="valorContrato"
              type="text"
              name="valorContrato"
              value={`R$ ${formatCurrency(contrato.valor)}`}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="card-data">
            <label htmlFor="validadeInicioProcesso" className="input-title">
              Início Processo:
            </label>
            <input
              className="input-border-data"
              id="dataInicioProcesso"
              type="date"
              name="dataInicioProcesso"
              value={contrato.dataInicioProcesso}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="card-data">
            <label htmlFor="ValidadeProcesso" className="input-title">
              Válidade Processo:
            </label>
            <input
              className="input-border-data"
              id="validadeProcesso"
              type="date"
              name="validadeProcesso"
              value={contrato.validadeProcesso}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GerarContrato;
