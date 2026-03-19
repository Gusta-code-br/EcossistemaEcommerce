// Dados mockados locais — nenhuma chamada HTTP é feita
// As integrações com o backend serão implementadas futuramente

export const products = [
  {
    id: "prod-001",
    nome: "Teclado Mecânico RGB Pro",
    preco: 459.9,
    estoque: 14,
    categoria: "Periféricos",
    descricao: "Switch Cherry MX Red, retroiluminação RGB personalizável.",
    imagem: "⌨️",
  },
  {
    id: "prod-002",
    nome: "Monitor Ultrawide 34\"",
    preco: 2899.0,
    estoque: 5,
    categoria: "Monitores",
    descricao: "Resolução 3440x1440, 144Hz, IPS, HDR400.",
    imagem: "🖥️",
  },
  {
    id: "prod-003",
    nome: "Mouse Gamer Sem Fio",
    preco: 349.9,
    estoque: 22,
    categoria: "Periféricos",
    descricao: "Sensor óptico 25.600 DPI, bateria de 70h.",
    imagem: "🖱️",
  },
  {
    id: "prod-004",
    nome: "Headset 7.1 Surround",
    preco: 299.0,
    estoque: 0,
    categoria: "Áudio",
    descricao: "Som surround virtual 7.1, microfone retrátil com noise cancel.",
    imagem: "🎧",
  },
  {
    id: "prod-005",
    nome: "SSD NVMe 1TB Gen4",
    preco: 549.9,
    estoque: 31,
    categoria: "Armazenamento",
    descricao: "Leitura 7.000 MB/s, escrita 6.500 MB/s.",
    imagem: "💾",
  },
  {
    id: "prod-006",
    nome: "Webcam 4K Streaming",
    preco: 389.0,
    estoque: 8,
    categoria: "Vídeo",
    descricao: "Resolução 4K/30fps, HDR, microfone estéreo embutido.",
    imagem: "📷",
  },
];

export const categorias = [...new Set(products.map((p) => p.categoria))];
