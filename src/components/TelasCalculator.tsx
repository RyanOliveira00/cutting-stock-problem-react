import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const TelasCalculator = () => {
  const [pecas, setPecas] = useState([]);
  const [formData, setFormData] = useState({
    largura: '',
    comprimento: '',
    quantidade: '1'
  });
  const [resultados, setResultados] = useState({
    telasNecessarias: 0,
    areaTotal: 0,
    aproveitamento: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.largura || 
      !formData.comprimento || 
      !formData.quantidade ||
      formData.largura > 2.45 ||
      formData.comprimento > 6
    ) {
      alert('Por favor, verifique os valores!\nLargura máx: 2.45m\nComprimento máx: 6m');
      return;
    }

    setPecas([...pecas, {
      id: Date.now(),
      largura: Number(formData.largura),
      comprimento: Number(formData.comprimento),
      quantidade: Number(formData.quantidade)
    }]);

    setFormData({
      largura: '',
      comprimento: '',
      quantidade: '1'
    });
  };

  const removePeca = (id) => {
    setPecas(pecas.filter(peca => peca.id !== id));
  };

  const calcularResultados = () => {
    const areaTotal = pecas.reduce((acc, peca) => {
      return acc + (peca.largura * peca.comprimento * peca.quantidade);
    }, 0);

    const areaTela = 2.45 * 6;
    const telasNecessarias = Math.ceil(areaTotal / areaTela);
    const aproveitamento = (areaTotal / (telasNecessarias * areaTela)) * 100;

    setResultados({
      telasNecessarias,
      areaTotal,
      aproveitamento
    });
  };

  useEffect(() => {
    calcularResultados();
  }, [pecas]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Calculadora de Telas</h1>
      
      {/* Resultados */}
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
              <p className="text-2xl">{resultados.aproveitamento.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário */}
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
                  onChange={(e) => setFormData({...formData, largura: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, comprimento: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
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

        {/* Lista de Peças */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lista de Peças</h2>
            <div className="space-y-4">
              {pecas.length === 0 ? (
                <p className="text-gray-500">Nenhuma peça adicionada</p>
              ) : (
                pecas.map(peca => (
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

      {/* Visualização */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Visualização</h2>
          <div className="w-full h-96 bg-gray-100 rounded relative">
            {pecas.map((peca, index) => {
              const cor = `hsl(${index * 137.5 % 360}, 50%, 50%)`;
              return Array(peca.quantidade).fill().map((_, i) => (
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
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

