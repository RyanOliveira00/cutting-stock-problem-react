import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Peca {
  id: number;
  largura: number;
  comprimento: number;
  quantidade: number;
  posicao?: { x: number; y: number };
}

interface FormData {
  largura: string;
  comprimento: string;
  quantidade: string;
}

interface Resultados {
  telasNecessarias: number;
  areaTotal: number;
  aproveitamento: number;
}

export function TelasCalculator() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [formData, setFormData] = useState<FormData>({
    largura: "",
    comprimento: "",
    quantidade: "1",
  });
  const [resultados, setResultados] = useState<Resultados>({
    telasNecessarias: 0,
    areaTotal: 0,
    aproveitamento: 0,
  });

  const [distribuicaoPecas, setDistribuicaoPecas] = useState<Peca[][]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.largura ||
      !formData.comprimento ||
      !formData.quantidade ||
      Number(formData.largura) > 2.45 ||
      Number(formData.comprimento) > 6
    ) {
      alert(
        "Por favor, verifique os valores!\nLargura máx: 2.45m\nComprimento máx: 6m"
      );
      return;
    }

    setPecas([
      ...pecas,
      {
        id: Date.now(),
        largura: Number(formData.largura),
        comprimento: Number(formData.comprimento),
        quantidade: Number(formData.quantidade),
      },
    ]);

    setFormData({
      largura: "",
      comprimento: "",
      quantidade: "1",
    });
  };

  const removePeca = (id: number) => {
    setPecas(pecas.filter((peca) => peca.id !== id));
  };

  const calcularResultados = () => {
    const telasDistribuidas = [];
    const pecasParaDistribuir = [...pecas];
    
    while (pecasParaDistribuir.length > 0) {
        const telaAtual = [];
        let larguraDisponivel = 2.45;
        
        // Tenta encaixar peças lado a lado na tela atual
        for (let i = pecasParaDistribuir.length - 1; i >= 0; i--) {
            const peca = pecasParaDistribuir[i];
            
            if (peca.largura <= larguraDisponivel && peca.quantidade > 0) {
                // Adiciona a peça à tela atual
                telaAtual.push({
                    ...peca,
                    quantidade: 1,
                    posicaoX: 2.45 - larguraDisponivel
                });
                
                // Atualiza a largura disponível
                larguraDisponivel -= peca.largura;
                
                // Atualiza a quantidade restante da peça
                peca.quantidade--;
                
                // Remove a peça se não houver mais unidades
                if (peca.quantidade === 0) {
                    pecasParaDistribuir.splice(i, 1);
                }
            }
        }
        
        // Se conseguiu adicionar alguma peça na tela
        if (telaAtual.length > 0) {
            telasDistribuidas.push(telaAtual);
        } else {
            // Se não conseguiu adicionar nenhuma peça, provavelmente há um problema
            break;
        }
    }
    
    const areaTotal = pecas.reduce((acc, peca) => 
        acc + (peca.largura * peca.comprimento * peca.quantidade), 0
    );
    const areaTela = 2.45 * 6;
    const telasNecessarias = telasDistribuidas.length;
    const aproveitamento = (areaTotal / (telasNecessarias * areaTela)) * 100;

    setResultados({
        telasNecessarias,
        areaTotal,
        aproveitamento
    });
    
    setDistribuicaoPecas(telasDistribuidas);
};

  useEffect(() => {
    calcularResultados();
  }, [pecas]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Calculadora de Telas
      </h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="font-semibold">Telas Necessárias</h3>
              <p className="text-2xl">{resultados.telasNecessarias}</p>
            </div>
            <div>
              <h3 className="font-semibold">Área Total</h3>
              <p className="text-2xl">{resultados.areaTotal.toFixed(2)} m²</p>
            </div>
            <div>
              <h3 className="font-semibold">Aproveitamento</h3>
              <p className="text-2xl">
                {resultados.aproveitamento.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Adicionar Peça</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Largura (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.largura}
                  onChange={(e) => handleInputChange(e, "largura")}
                  className="w-full p-2 border rounded"
                  max="2.45"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Comprimento (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.comprimento}
                  onChange={(e) => handleInputChange(e, "comprimento")}
                  className="w-full p-2 border rounded"
                  max="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => handleInputChange(e, "quantidade")}
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Adicionar Peça
              </button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lista de Peças</h2>
            <div className="space-y-4">
              {pecas.length === 0 ? (
                <p className="text-gray-500">Nenhuma peça adicionada</p>
              ) : (
                pecas.map((peca) => (
                  <div
                    key={peca.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {peca.largura}m x {peca.comprimento}m
                      </span>
                      <span className="ml-2 text-gray-600">
                        (Qtd: {peca.quantidade})
                      </span>
                    </div>
                    <button
                      onClick={() => removePeca(peca.id)}
                      className="text-red-500 hover:text-red-600"
                      type="button"
                    >
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Visualização</h2>
          <div className="w-full h-96 bg-gray-100 rounded relative">
            <TelasVisualization
              pecas={pecas}
              distribuicao={distribuicaoPecas}
            />
            {/* {pecas.map((peca, index) => {
              const cor = `hsl(${index * 137.5 % 360}, 50%, 50%)`;
              return Array(peca.quantidade).fill(null).map((_, i) => (
                <div
                  key={`${peca.id}-${i}`}
                  className="absolute border border-white"
                  style={{
                    width: `${(peca.largura / 2.45) * 100}%`,
                    height: `${(peca.comprimento / 6) * 100}%`,
                    backgroundColor: cor,
                    opacity: 0.7,
                    left: '0%',
                    top: '0%'
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                    {peca.largura}x{peca.comprimento}
                  </span>
                </div>
              ));
            })} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// interface Peca {
//   id: number;
//   largura: number;
//   comprimento: number;
//   quantidade: number;
// }

interface TelasVisualizationProps {
  pecas: Peca[];
  distribuicao: Array<Array<Peca>>;
}

function TelasVisualization({ pecas, distribuicao }: TelasVisualizationProps) {
  const TELAS_A_MOSTRAR = 3;
  const totalTelas = distribuicao.length;

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Visualização</h2>
        <div className="space-y-8">
          {distribuicao.slice(0, TELAS_A_MOSTRAR).map((tela, telaIndex) => (
            <div key={telaIndex} className="relative">
              <div className="w-full h-40 bg-gray-100 rounded border-2 border-gray-300 mb-4">
                {/* Título da tela */}
                <div className="absolute -top-6 left-0 font-medium">
                  Tela {telaIndex + 1}
                </div>

                {/* Grade de medidas */}
                <div className="absolute -left-16 h-full flex flex-col justify-between text-sm text-gray-500">
                  <span>6m</span>
                  <span>3m</span>
                  <span>0m</span>
                </div>
                <div className="absolute -bottom-6 w-full flex justify-between text-sm text-gray-500">
                  <span>0m</span>
                  <span>1.225m</span>
                  <span>2.45m</span>
                </div>

                {/* Linhas de grade */}
                <div className="absolute inset-0 grid grid-cols-2 divide-x divide-gray-300">
                  <div className="grid grid-rows-2 divide-y divide-gray-300">
                    <div></div>
                    <div></div>
                  </div>
                  <div className="grid grid-rows-2 divide-y divide-gray-300">
                    <div></div>
                    <div></div>
                  </div>
                </div>

                {/* Peças na tela */}
                {tela.map((peca, pecaIndex) => {
    const cor = `hsl(${peca.id * 137.5 % 360}, 50%, 50%)`;
    
    return (
        <div
            key={`${peca.id}-${pecaIndex}`}
            className="absolute border border-white transition-opacity hover:opacity-80"
            style={{
                width: `${(peca.largura / 2.45) * 100}%`,
                height: `${(peca.comprimento / 6) * 100}%`,
                backgroundColor: cor,
                opacity: 0.7,
                // left: `${(peca.posicao!.x / 2.45) * 100}%`,
                // top: `${(peca.posicao!.y / 6) * 100}%`
            }}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
                <span>{peca.largura}m x {peca.comprimento}m</span>
            </div>
        </div>
    );
})}
                {/* {tela.map((peca, pecaIndex) => {
                  const cor = `hsl(${(peca.id * 137.5) % 360}, 50%, 50%)`;
                  // Calcula a posição Y baseada nas peças anteriores
                  const offsetY = tela
                    .slice(0, pecaIndex)
                    .reduce((acc, p) => acc + p.comprimento, 0);

                  return (
                    <div
                      key={`${peca.id}-${pecaIndex}`}
                      className="absolute border border-white transition-opacity hover:opacity-80"
                      style={{
                        width: `${(peca.largura / 2.45) * 100}%`,
                        height: `${(peca.comprimento / 6) * 100}%`,
                        backgroundColor: cor,
                        opacity: 0.7,
                        left: "0%",
                        top: `${(offsetY / 6) * 100}%`,
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
                        <span>
                          {peca.largura}m x {peca.comprimento}m
                        </span>
                      </div>
                    </div>
                  );
                })} */}
              </div>

              {/* Informações da tela */}
              <div className="text-sm text-gray-600 mt-1">
                Peças nesta tela:{" "}
                {tela.map((p) => `${p.largura}x${p.comprimento}m`).join(" + ")}
              </div>
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-8">
          <h3 className="font-medium mb-2">Peças Cadastradas:</h3>
          <div className="flex flex-wrap gap-4">
            {pecas.map((peca) => (
              <div key={peca.id} className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{
                    backgroundColor: `hsl(${
                      (peca.id * 137.5) % 360
                    }, 50%, 50%)`,
                  }}
                ></div>
                <span>
                  {peca.largura}m x {peca.comprimento}m ({peca.quantidade}{" "}
                  {peca.quantidade === 1 ? "peça" : "peças"})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nota informativa */}
        {totalTelas > TELAS_A_MOSTRAR && (
          <div className="mt-4 text-gray-500 text-sm">
            * Mostrando {TELAS_A_MOSTRAR} de {totalTelas} telas necessárias
          </div>
        )}
      </CardContent>
    </Card>
  );
}
