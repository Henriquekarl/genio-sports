const { initDb, run } = require('./db');

const products = [
  {
    "id": "camisa-flamengo-home",
    "type": "camisa",
    "team": "Flamengo",
    "category": null,
    "home_section": null,
    "name": "Flamengo Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/flamengo-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-flamengo-away",
    "type": "camisa",
    "team": "Flamengo",
    "category": null,
    "home_section": null,
    "name": "Flamengo Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/flamengo-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-flamengo-third",
    "type": "camisa",
    "team": "Flamengo",
    "category": null,
    "home_section": null,
    "name": "Flamengo Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/flamengo-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-flamengo-retro",
    "type": "camisa",
    "team": "Flamengo",
    "category": null,
    "home_section": null,
    "name": "Flamengo Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/flamengo-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-corinthians-home",
    "type": "camisa",
    "team": "Corinthians",
    "category": null,
    "home_section": null,
    "name": "Corinthians Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/corinthians-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-corinthians-away",
    "type": "camisa",
    "team": "Corinthians",
    "category": null,
    "home_section": null,
    "name": "Corinthians Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/corinthians-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-corinthians-third",
    "type": "camisa",
    "team": "Corinthians",
    "category": null,
    "home_section": null,
    "name": "Corinthians Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/corinthians-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-corinthians-retro",
    "type": "camisa",
    "team": "Corinthians",
    "category": null,
    "home_section": null,
    "name": "Corinthians Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/corinthians-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-palmeiras-home",
    "type": "camisa",
    "team": "Palmeiras",
    "category": null,
    "home_section": null,
    "name": "Palmeiras Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/palmeiras-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-palmeiras-away",
    "type": "camisa",
    "team": "Palmeiras",
    "category": null,
    "home_section": null,
    "name": "Palmeiras Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/palmeiras-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-palmeiras-third",
    "type": "camisa",
    "team": "Palmeiras",
    "category": null,
    "home_section": null,
    "name": "Palmeiras Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/palmeiras-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-palmeiras-retro",
    "type": "camisa",
    "team": "Palmeiras",
    "category": null,
    "home_section": null,
    "name": "Palmeiras Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/palmeiras-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-sao-paulo-home",
    "type": "camisa",
    "team": "São Paulo",
    "category": null,
    "home_section": null,
    "name": "São Paulo Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/saopaulo-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-sao-paulo-away",
    "type": "camisa",
    "team": "São Paulo",
    "category": null,
    "home_section": null,
    "name": "São Paulo Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/saopaulo-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-sao-paulo-third",
    "type": "camisa",
    "team": "São Paulo",
    "category": null,
    "home_section": null,
    "name": "São Paulo Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/saopaulo-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-sao-paulo-retro",
    "type": "camisa",
    "team": "São Paulo",
    "category": null,
    "home_section": null,
    "name": "São Paulo Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/saopaulo-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-santos-home-25-26",
    "type": "camisa",
    "team": "Santos",
    "category": null,
    "home_section": null,
    "name": "Santos Home 25/26",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Santos 25-26 Home.jpeg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-santos-third-25-26",
    "type": "camisa",
    "team": "Santos",
    "category": null,
    "home_section": null,
    "name": "Santos Third 25/26",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Santos 25-26 Third.jpeg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-santos-retro-home-2011-12",
    "type": "camisa",
    "team": "Santos",
    "category": null,
    "home_section": null,
    "name": "Santos Retrô Home 2011/12",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Retro 2011-12 Santos Home.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-santos-retro-home-2001",
    "type": "camisa",
    "team": "Santos",
    "category": null,
    "home_section": null,
    "name": "Santos Retrô Home 2001",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Retro 2001 Santos Home Jersey.jpeg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-santos-retro-away-1996",
    "type": "camisa",
    "team": "Santos",
    "category": null,
    "home_section": null,
    "name": "Santos Retrô Away 1996",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Retro 1996 Santos Away.jpeg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-gremio-home",
    "type": "camisa",
    "team": "Grêmio",
    "category": null,
    "home_section": null,
    "name": "Grêmio Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/gremio-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-gremio-away",
    "type": "camisa",
    "team": "Grêmio",
    "category": null,
    "home_section": null,
    "name": "Grêmio Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/gremio-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-gremio-third",
    "type": "camisa",
    "team": "Grêmio",
    "category": null,
    "home_section": null,
    "name": "Grêmio Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/gremio-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-gremio-retro",
    "type": "camisa",
    "team": "Grêmio",
    "category": null,
    "home_section": null,
    "name": "Grêmio Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/gremio-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-internacional-home",
    "type": "camisa",
    "team": "Internacional",
    "category": null,
    "home_section": null,
    "name": "Internacional Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/internacional-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-internacional-away",
    "type": "camisa",
    "team": "Internacional",
    "category": null,
    "home_section": null,
    "name": "Internacional Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/internacional-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-internacional-third",
    "type": "camisa",
    "team": "Internacional",
    "category": null,
    "home_section": null,
    "name": "Internacional Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/internacional-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-internacional-retro",
    "type": "camisa",
    "team": "Internacional",
    "category": null,
    "home_section": null,
    "name": "Internacional Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/internacional-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-cruzeiro-home",
    "type": "camisa",
    "team": "Cruzeiro",
    "category": null,
    "home_section": null,
    "name": "Cruzeiro Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/cruzeiro-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-cruzeiro-away",
    "type": "camisa",
    "team": "Cruzeiro",
    "category": null,
    "home_section": null,
    "name": "Cruzeiro Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/cruzeiro-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-cruzeiro-third",
    "type": "camisa",
    "team": "Cruzeiro",
    "category": null,
    "home_section": null,
    "name": "Cruzeiro Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/cruzeiro-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-cruzeiro-retro",
    "type": "camisa",
    "team": "Cruzeiro",
    "category": null,
    "home_section": null,
    "name": "Cruzeiro Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/cruzeiro-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-atletico-mineiro-home",
    "type": "camisa",
    "team": "Atlético Mineiro",
    "category": null,
    "home_section": null,
    "name": "Atlético Mineiro Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/atleticomineiro-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-atletico-mineiro-away",
    "type": "camisa",
    "team": "Atlético Mineiro",
    "category": null,
    "home_section": null,
    "name": "Atlético Mineiro Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/atleticomineiro-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-atletico-mineiro-third",
    "type": "camisa",
    "team": "Atlético Mineiro",
    "category": null,
    "home_section": null,
    "name": "Atlético Mineiro Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/atleticomineiro-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-atletico-mineiro-retro",
    "type": "camisa",
    "team": "Atlético Mineiro",
    "category": null,
    "home_section": null,
    "name": "Atlético Mineiro Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/atleticomineiro-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-botafogo-home",
    "type": "camisa",
    "team": "Botafogo",
    "category": null,
    "home_section": null,
    "name": "Botafogo Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/botafogo-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-botafogo-away",
    "type": "camisa",
    "team": "Botafogo",
    "category": null,
    "home_section": null,
    "name": "Botafogo Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/botafogo-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-botafogo-third",
    "type": "camisa",
    "team": "Botafogo",
    "category": null,
    "home_section": null,
    "name": "Botafogo Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/botafogo-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-botafogo-retro",
    "type": "camisa",
    "team": "Botafogo",
    "category": null,
    "home_section": null,
    "name": "Botafogo Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/botafogo-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-remo-home",
    "type": "camisa",
    "team": "Remo",
    "category": null,
    "home_section": null,
    "name": "Remo Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/remo-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-remo-away",
    "type": "camisa",
    "team": "Remo",
    "category": null,
    "home_section": null,
    "name": "Remo Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/remo-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-remo-third",
    "type": "camisa",
    "team": "Remo",
    "category": null,
    "home_section": null,
    "name": "Remo Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/remo-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-remo-retro",
    "type": "camisa",
    "team": "Remo",
    "category": null,
    "home_section": null,
    "name": "Remo Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/remo-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-real-madrid-dragon-special-24-25",
    "type": "camisa",
    "team": "Real Madrid",
    "category": null,
    "home_section": null,
    "name": "Real Madrid Dragon Special 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/real_madrid_dragon_special_24-25.jpeg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-barcelona-home",
    "type": "camisa",
    "team": "Barcelona",
    "category": null,
    "home_section": null,
    "name": "Barcelona Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/barcelona-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-barcelona-away",
    "type": "camisa",
    "team": "Barcelona",
    "category": null,
    "home_section": null,
    "name": "Barcelona Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/barcelona-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-barcelona-third",
    "type": "camisa",
    "team": "Barcelona",
    "category": null,
    "home_section": null,
    "name": "Barcelona Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/barcelona-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-barcelona-retro",
    "type": "camisa",
    "team": "Barcelona",
    "category": null,
    "home_section": null,
    "name": "Barcelona Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/barcelona-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-manchester-city-home-24-25",
    "type": "camisa",
    "team": "Manchester City",
    "category": null,
    "home_section": null,
    "name": "Manchester City Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/manchester_city_home_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-manchester-united-away-24-25",
    "type": "camisa",
    "team": "Manchester United",
    "category": null,
    "home_section": null,
    "name": "Manchester United Away 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/manchester_united_away_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-liverpool-away-24-25",
    "type": "camisa",
    "team": "Liverpool",
    "category": null,
    "home_section": null,
    "name": "Liverpool Away 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/liverpool_away_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-arsenal-home-25-26",
    "type": "camisa",
    "team": "Arsenal",
    "category": null,
    "home_section": null,
    "name": "Arsenal Home 25/26",
    "description": "Camisa tailandesa",
    "image_url": "imagens/arsenal_home_25-26.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-arsenal-third-24-25",
    "type": "camisa",
    "team": "Arsenal",
    "category": null,
    "home_section": null,
    "name": "Arsenal Third 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/arsenal_third_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-chelsea-home-25-26",
    "type": "camisa",
    "team": "Chelsea",
    "category": null,
    "home_section": null,
    "name": "Chelsea Home 25/26",
    "description": "Camisa tailandesa",
    "image_url": "imagens/chelsea_home_25-26.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-chelsea-away-25-26",
    "type": "camisa",
    "team": "Chelsea",
    "category": null,
    "home_section": null,
    "name": "Chelsea Away 25/26",
    "description": "Camisa tailandesa",
    "image_url": "imagens/chelsea_away_25-26.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-psg-away-24-25",
    "type": "camisa",
    "team": "PSG",
    "category": null,
    "home_section": null,
    "name": "PSG Away 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/psg_away_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-psg-third-24-25",
    "type": "camisa",
    "team": "PSG",
    "category": null,
    "home_section": null,
    "name": "PSG Third 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/psg_third_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-bayern-home-24-25",
    "type": "camisa",
    "team": "Bayern",
    "category": null,
    "home_section": null,
    "name": "Bayern Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Bayern de Munich Home 24-25.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-juventus-home-24-25",
    "type": "camisa",
    "team": "Juventus",
    "category": null,
    "home_section": null,
    "name": "Juventus Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Juventus Home 24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-milan-home-24-25",
    "type": "camisa",
    "team": "Milan",
    "category": null,
    "home_section": null,
    "name": "Milan Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/milan_home_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-lazio-special-24-25",
    "type": "camisa",
    "team": "Lazio",
    "category": null,
    "home_section": null,
    "name": "Lazio Special 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/lazio_special_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-inter-de-milao-home-24-25",
    "type": "camisa",
    "team": "Inter de Milão",
    "category": null,
    "home_section": null,
    "name": "Inter de Milão Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/inter_home_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-roma-home-22-23",
    "type": "camisa",
    "team": "Roma",
    "category": null,
    "home_section": null,
    "name": "Roma Home 22/23",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Roma Home 22-23.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-borussia-dortmund-home-24-25",
    "type": "camisa",
    "team": "Borussia Dortmund",
    "category": null,
    "home_section": null,
    "name": "Borussia Dortmund Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Camisa Borussia Dortmund Home 24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-ajax-away-24-25",
    "type": "camisa",
    "team": "Ajax",
    "category": null,
    "home_section": null,
    "name": "Ajax Away 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/ajax_away_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-atletico-de-madrid-home-24-25",
    "type": "camisa",
    "team": "Atlético de Madrid",
    "category": null,
    "home_section": null,
    "name": "Atlético de Madrid Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/atletico_de_madrid_home_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-tottenham-home-24-25",
    "type": "camisa",
    "team": "Tottenham",
    "category": null,
    "home_section": null,
    "name": "Tottenham Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/tottenham_home_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-tottenham-away-24-25",
    "type": "camisa",
    "team": "Tottenham",
    "category": null,
    "home_section": null,
    "name": "Tottenham Away 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/tottenham_away_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-aston-villa-home-22-23",
    "type": "camisa",
    "team": "Aston Villa",
    "category": null,
    "home_section": null,
    "name": "Aston Villa Home 22/23",
    "description": "Camisa tailandesa",
    "image_url": "imagens/aston_villa_home_22-23.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-porto-home-24-25",
    "type": "camisa",
    "team": "Porto",
    "category": null,
    "home_section": null,
    "name": "Porto Home 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/porto_home_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-porto-away-24-25",
    "type": "camisa",
    "team": "Porto",
    "category": null,
    "home_section": null,
    "name": "Porto Away 24/25",
    "description": "Camisa tailandesa",
    "image_url": "imagens/porto_away_24-25.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-gijon-home-25-26",
    "type": "camisa",
    "team": "Gijon",
    "category": null,
    "home_section": null,
    "name": "Gijon Home 25/26",
    "description": "Camisa tailandesa",
    "image_url": "imagens/Sporting Gijon Home 25-26.webp",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-brasil-home",
    "type": "camisa",
    "team": "Brasil",
    "category": null,
    "home_section": null,
    "name": "Brasil Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/brasil-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-brasil-away",
    "type": "camisa",
    "team": "Brasil",
    "category": null,
    "home_section": null,
    "name": "Brasil Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/brasil-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-brasil-third",
    "type": "camisa",
    "team": "Brasil",
    "category": null,
    "home_section": null,
    "name": "Brasil Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/brasil-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-brasil-retro",
    "type": "camisa",
    "team": "Brasil",
    "category": null,
    "home_section": null,
    "name": "Brasil Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/brasil-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-argentina-home",
    "type": "camisa",
    "team": "Argentina",
    "category": null,
    "home_section": null,
    "name": "Argentina Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/argentina-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-argentina-away",
    "type": "camisa",
    "team": "Argentina",
    "category": null,
    "home_section": null,
    "name": "Argentina Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/argentina-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-argentina-third",
    "type": "camisa",
    "team": "Argentina",
    "category": null,
    "home_section": null,
    "name": "Argentina Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/argentina-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-argentina-retro",
    "type": "camisa",
    "team": "Argentina",
    "category": null,
    "home_section": null,
    "name": "Argentina Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/argentina-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-portugal-home",
    "type": "camisa",
    "team": "Portugal",
    "category": null,
    "home_section": null,
    "name": "Portugal Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/portugal-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-portugal-away",
    "type": "camisa",
    "team": "Portugal",
    "category": null,
    "home_section": null,
    "name": "Portugal Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/portugal-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-portugal-third",
    "type": "camisa",
    "team": "Portugal",
    "category": null,
    "home_section": null,
    "name": "Portugal Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/portugal-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-portugal-retro",
    "type": "camisa",
    "team": "Portugal",
    "category": null,
    "home_section": null,
    "name": "Portugal Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/portugal-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-franca-home",
    "type": "camisa",
    "team": "França",
    "category": null,
    "home_section": null,
    "name": "França Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/franca-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-franca-away",
    "type": "camisa",
    "team": "França",
    "category": null,
    "home_section": null,
    "name": "França Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/franca-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-franca-third",
    "type": "camisa",
    "team": "França",
    "category": null,
    "home_section": null,
    "name": "França Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/franca-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-franca-retro",
    "type": "camisa",
    "team": "França",
    "category": null,
    "home_section": null,
    "name": "França Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/franca-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-alemanha-home",
    "type": "camisa",
    "team": "Alemanha",
    "category": null,
    "home_section": null,
    "name": "Alemanha Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/alemanha-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-alemanha-away",
    "type": "camisa",
    "team": "Alemanha",
    "category": null,
    "home_section": null,
    "name": "Alemanha Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/alemanha-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-alemanha-third",
    "type": "camisa",
    "team": "Alemanha",
    "category": null,
    "home_section": null,
    "name": "Alemanha Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/alemanha-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-alemanha-retro",
    "type": "camisa",
    "team": "Alemanha",
    "category": null,
    "home_section": null,
    "name": "Alemanha Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/alemanha-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-espanha-home",
    "type": "camisa",
    "team": "Espanha",
    "category": null,
    "home_section": null,
    "name": "Espanha Home",
    "description": "Camisa tailandesa",
    "image_url": "imagens/espanha-home.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-espanha-away",
    "type": "camisa",
    "team": "Espanha",
    "category": null,
    "home_section": null,
    "name": "Espanha Away",
    "description": "Camisa tailandesa",
    "image_url": "imagens/espanha-away.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-espanha-third",
    "type": "camisa",
    "team": "Espanha",
    "category": null,
    "home_section": null,
    "name": "Espanha Third",
    "description": "Camisa tailandesa",
    "image_url": "imagens/espanha-third.jpg",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "camisa-espanha-retro",
    "type": "camisa",
    "team": "Espanha",
    "category": null,
    "home_section": null,
    "name": "Espanha Retrô",
    "description": "Camisa tailandesa",
    "image_url": "imagens/espanha-retro.jpg",
    "base_price": 190.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Produto de futebol\",\"Consulte disponibilidade para encomenda\"]",
    "option_groups_json": "[]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "feminino-linha-feminina",
    "type": "camisa",
    "team": null,
    "category": "Feminino",
    "home_section": null,
    "name": "Linha Feminina",
    "description": "Camisa feminina tailandesa premium",
    "image_url": "",
    "base_price": 160.0,
    "price_label": "Preço final conforme modelo, tamanho e personalização",
    "allow_customization": 1,
    "only_consultation": 0,
    "specs_json": "[\"Feminino\",\"Camisa feminina tailandesa premium\"]",
    "option_groups_json": "[{\"name\":\"Modelo\",\"type\":\"single\",\"values\":[{\"value\":\"torcedor\",\"label\":\"Torcedor\",\"priceAdjustment\":0},{\"value\":\"jogador\",\"label\":\"Jogador\",\"priceAdjustment\":60},{\"value\":\"manga-longa\",\"label\":\"Manga longa\",\"priceAdjustment\":120}]}]",
    "customization_json": "[{\"key\":\"nome\",\"label\":\"Nome\",\"priceAdjustment\":20},{\"key\":\"numero\",\"label\":\"Número\",\"priceAdjustment\":20},{\"key\":\"patch\",\"label\":\"Patch\",\"priceAdjustment\":30}]",
    "size_profiles_json": "[]"
  },
  {
    "id": "shorts-shorts-futebol",
    "type": "extra",
    "team": null,
    "category": "Shorts",
    "home_section": null,
    "name": "Shorts Futebol",
    "description": "Shorts futebol",
    "image_url": "",
    "base_price": 120.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Shorts\",\"Shorts futebol\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "shorts-shorts-nba",
    "type": "extra",
    "team": null,
    "category": "Shorts",
    "home_section": null,
    "name": "Shorts NBA",
    "description": "Shorts NBA",
    "image_url": "",
    "base_price": 140.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Shorts\",\"Shorts NBA\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "agasalhos-blusa-3-cabos",
    "type": "extra",
    "team": null,
    "category": "Agasalhos",
    "home_section": null,
    "name": "Blusa 3 Cabos",
    "description": "Blusa 3 cabos",
    "image_url": "",
    "base_price": 180.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Agasalhos\",\"Blusa 3 cabos\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "agasalhos-treino-calca-e-blusa",
    "type": "extra",
    "team": null,
    "category": "Agasalhos",
    "home_section": null,
    "name": "Treino Calça e Blusa",
    "description": "Treino calça e blusa",
    "image_url": "",
    "base_price": 320.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Agasalhos\",\"Treino calça e blusa\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "agasalhos-treino-calca-e-camisa",
    "type": "extra",
    "team": null,
    "category": "Agasalhos",
    "home_section": null,
    "name": "Treino Calça e Camisa",
    "description": "Treino calça e camisa",
    "image_url": "",
    "base_price": 290.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Agasalhos\",\"Treino calça e camisa\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "agasalhos-treino-bermuda-e-manga-curta-ou-regata",
    "type": "extra",
    "team": null,
    "category": "Agasalhos",
    "home_section": null,
    "name": "Treino Bermuda e Manga Curta ou Regata",
    "description": "Treino bermuda e manga curta ou regata",
    "image_url": "",
    "base_price": 260.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Agasalhos\",\"Treino bermuda e manga curta ou regata\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "agasalhos-corta-vento",
    "type": "extra",
    "team": null,
    "category": "Agasalhos",
    "home_section": null,
    "name": "Corta Vento",
    "description": "Corta vento e outros",
    "image_url": "",
    "base_price": 320.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Agasalhos\",\"Corta vento e outros\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "agasalhos-bobojaco",
    "type": "extra",
    "team": null,
    "category": "Agasalhos",
    "home_section": null,
    "name": "Bobojaco",
    "description": "Bobojaco",
    "image_url": "",
    "base_price": 420.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Agasalhos\",\"Bobojaco\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "outros-produtos-kit-infantil",
    "type": "extra",
    "team": null,
    "category": "Outros produtos",
    "home_section": null,
    "name": "Kit Infantil",
    "description": "Kit infantil",
    "image_url": "",
    "base_price": 190.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Outros produtos\",\"Kit infantil\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "outros-produtos-f1-camisas",
    "type": "extra",
    "team": null,
    "category": "Outros produtos",
    "home_section": null,
    "name": "F1 (Camisas)",
    "description": "F1 (camisas)",
    "image_url": "",
    "base_price": 250.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Outros produtos\",\"F1 (camisas)\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "outros-produtos-nba",
    "type": "extra",
    "team": null,
    "category": "Outros produtos",
    "home_section": null,
    "name": "NBA",
    "description": "NBA",
    "image_url": "",
    "base_price": 240.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Outros produtos\",\"NBA\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  },
  {
    "id": "outros-produtos-nfl",
    "type": "extra",
    "team": null,
    "category": "Outros produtos",
    "home_section": null,
    "name": "NFL",
    "description": "NFL",
    "image_url": "",
    "base_price": 240.0,
    "price_label": "Preço conforme catálogo e variações",
    "allow_customization": 0,
    "only_consultation": 0,
    "specs_json": "[\"Outros produtos\",\"NFL\"]",
    "option_groups_json": "[]",
    "customization_json": "[]",
    "size_profiles_json": "[]"
  }
];

const productSizes = [
  {
    "product_id": "agasalhos-blusa-3-cabos",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-blusa-3-cabos",
    "size": "GG",
    "stock_quantity": 2
  },
  {
    "product_id": "agasalhos-blusa-3-cabos",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-bobojaco",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-bobojaco",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "agasalhos-bobojaco",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-bobojaco",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-corta-vento",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-corta-vento",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "agasalhos-corta-vento",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-corta-vento",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-bermuda-e-manga-curta-ou-regata",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-bermuda-e-manga-curta-ou-regata",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "agasalhos-treino-bermuda-e-manga-curta-ou-regata",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-bermuda-e-manga-curta-ou-regata",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-calca-e-blusa",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-calca-e-blusa",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "agasalhos-treino-calca-e-blusa",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-calca-e-blusa",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-calca-e-camisa",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-calca-e-camisa",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "agasalhos-treino-calca-e-camisa",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "agasalhos-treino-calca-e-camisa",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-ajax-away-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-ajax-away-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-ajax-away-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-ajax-away-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-ajax-away-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-ajax-away-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-alemanha-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-alemanha-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-alemanha-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-alemanha-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-alemanha-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-alemanha-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-argentina-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-argentina-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-argentina-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-argentina-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-argentina-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-argentina-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-arsenal-home-25-26",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-arsenal-home-25-26",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-arsenal-home-25-26",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-arsenal-home-25-26",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-arsenal-home-25-26",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-arsenal-home-25-26",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-arsenal-third-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-arsenal-third-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-arsenal-third-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-arsenal-third-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-arsenal-third-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-arsenal-third-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-aston-villa-home-22-23",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-aston-villa-home-22-23",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-aston-villa-home-22-23",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-aston-villa-home-22-23",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-aston-villa-home-22-23",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-aston-villa-home-22-23",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-de-madrid-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-de-madrid-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-atletico-de-madrid-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-de-madrid-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-de-madrid-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-de-madrid-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-atletico-mineiro-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-atletico-mineiro-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-atletico-mineiro-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-atletico-mineiro-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-atletico-mineiro-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-atletico-mineiro-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-barcelona-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-barcelona-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-barcelona-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-barcelona-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-barcelona-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-barcelona-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-bayern-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-bayern-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-bayern-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-bayern-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-bayern-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-bayern-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-borussia-dortmund-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-borussia-dortmund-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-borussia-dortmund-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-borussia-dortmund-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-borussia-dortmund-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-borussia-dortmund-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-botafogo-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-botafogo-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-botafogo-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-botafogo-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-botafogo-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-botafogo-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-brasil-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-brasil-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-brasil-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-brasil-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-brasil-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-brasil-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-chelsea-away-25-26",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-chelsea-away-25-26",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-chelsea-away-25-26",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-chelsea-away-25-26",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-chelsea-away-25-26",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-chelsea-away-25-26",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-chelsea-home-25-26",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-chelsea-home-25-26",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-chelsea-home-25-26",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-chelsea-home-25-26",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-chelsea-home-25-26",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-chelsea-home-25-26",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-corinthians-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-corinthians-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-corinthians-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-corinthians-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-corinthians-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-corinthians-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-cruzeiro-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-cruzeiro-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-cruzeiro-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-cruzeiro-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-cruzeiro-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-cruzeiro-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-espanha-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-espanha-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-espanha-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-espanha-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-espanha-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-espanha-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-flamengo-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-flamengo-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-flamengo-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-flamengo-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-flamengo-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-flamengo-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-franca-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-franca-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-franca-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-franca-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-franca-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-franca-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gijon-home-25-26",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gijon-home-25-26",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-gijon-home-25-26",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gijon-home-25-26",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gijon-home-25-26",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gijon-home-25-26",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-gremio-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-gremio-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-gremio-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-gremio-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-gremio-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-gremio-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-inter-de-milao-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-inter-de-milao-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-inter-de-milao-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-inter-de-milao-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-inter-de-milao-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-inter-de-milao-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-internacional-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-internacional-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-internacional-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-internacional-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-internacional-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-internacional-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-juventus-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-juventus-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-juventus-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-juventus-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-juventus-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-juventus-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-lazio-special-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-lazio-special-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-lazio-special-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-lazio-special-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-lazio-special-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-lazio-special-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-liverpool-away-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-liverpool-away-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-liverpool-away-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-liverpool-away-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-liverpool-away-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-liverpool-away-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-manchester-city-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-manchester-city-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-manchester-city-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-manchester-city-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-manchester-city-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-manchester-city-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-manchester-united-away-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-manchester-united-away-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-manchester-united-away-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-manchester-united-away-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-manchester-united-away-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-manchester-united-away-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-milan-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-milan-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-milan-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-milan-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-milan-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-milan-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-palmeiras-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-palmeiras-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-palmeiras-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-palmeiras-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-palmeiras-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-palmeiras-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-porto-away-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-porto-away-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-porto-away-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-porto-away-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-porto-away-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-porto-away-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-porto-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-porto-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-porto-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-porto-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-porto-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-porto-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-portugal-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-portugal-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-portugal-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-portugal-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-portugal-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-portugal-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-psg-away-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-psg-away-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-psg-away-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-psg-away-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-psg-away-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-psg-away-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-psg-third-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-psg-third-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-psg-third-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-psg-third-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-psg-third-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-psg-third-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-real-madrid-dragon-special-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-real-madrid-dragon-special-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-real-madrid-dragon-special-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-real-madrid-dragon-special-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-real-madrid-dragon-special-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-real-madrid-dragon-special-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-remo-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-remo-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-remo-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-remo-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-remo-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-remo-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-roma-home-22-23",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-roma-home-22-23",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-roma-home-22-23",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-roma-home-22-23",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-roma-home-22-23",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-roma-home-22-23",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-home-25-26",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-home-25-26",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-santos-home-25-26",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-home-25-26",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-home-25-26",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-home-25-26",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-away-1996",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-away-1996",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-santos-retro-away-1996",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-retro-away-1996",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-retro-away-1996",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-away-1996",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-home-2001",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-home-2001",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-santos-retro-home-2001",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-retro-home-2001",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-retro-home-2001",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-home-2001",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-home-2011-12",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-home-2011-12",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-santos-retro-home-2011-12",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-retro-home-2011-12",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-retro-home-2011-12",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-retro-home-2011-12",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-third-25-26",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-third-25-26",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-santos-third-25-26",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-third-25-26",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-santos-third-25-26",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-santos-third-25-26",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-away",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-away",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-sao-paulo-away",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-away",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-away",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-away",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-home",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-home",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-sao-paulo-home",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-home",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-home",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-home",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-retro",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-retro",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-sao-paulo-retro",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-retro",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-retro",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-retro",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-third",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-third",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-sao-paulo-third",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-third",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-sao-paulo-third",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-sao-paulo-third",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-tottenham-away-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-tottenham-away-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-tottenham-away-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-tottenham-away-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-tottenham-away-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-tottenham-away-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-tottenham-home-24-25",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-tottenham-home-24-25",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "camisa-tottenham-home-24-25",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-tottenham-home-24-25",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "camisa-tottenham-home-24-25",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "camisa-tottenham-home-24-25",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "feminino-linha-feminina",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "feminino-linha-feminina",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "feminino-linha-feminina",
    "size": "G3",
    "stock_quantity": 1
  },
  {
    "product_id": "feminino-linha-feminina",
    "size": "G4",
    "stock_quantity": 1
  },
  {
    "product_id": "feminino-linha-feminina",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "feminino-linha-feminina",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-f1-camisas",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-f1-camisas",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-f1-camisas",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-f1-camisas",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "10",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "12",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "14",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "2",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "4",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "6",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-kit-infantil",
    "size": "8",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-nba",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-nba",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-nba",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-nba",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-nfl",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-nfl",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "outros-produtos-nfl",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "outros-produtos-nfl",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "shorts-shorts-futebol",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "shorts-shorts-futebol",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "shorts-shorts-futebol",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "shorts-shorts-futebol",
    "size": "P",
    "stock_quantity": 3
  },
  {
    "product_id": "shorts-shorts-nba",
    "size": "G",
    "stock_quantity": 3
  },
  {
    "product_id": "shorts-shorts-nba",
    "size": "G2",
    "stock_quantity": 2
  },
  {
    "product_id": "shorts-shorts-nba",
    "size": "M",
    "stock_quantity": 3
  },
  {
    "product_id": "shorts-shorts-nba",
    "size": "P",
    "stock_quantity": 3
  }
];

async function seed() {
  await initDb();

  await run('DELETE FROM product_sizes');
  await run('DELETE FROM products');

  for (const product of products) {
    await run(
      `INSERT INTO products (
        id,
        type,
        team,
        category,
        home_section,
        name,
        description,
        image_url,
        base_price,
        price_label,
        allow_customization,
        only_consultation,
        specs_json,
        option_groups_json,
        customization_json,
        size_profiles_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.type,
        product.team,
        product.category,
        product.home_section,
        product.name,
        product.description,
        product.image_url,
        product.base_price,
        product.price_label,
        product.allow_customization,
        product.only_consultation,
        product.specs_json,
        product.option_groups_json,
        product.customization_json,
        product.size_profiles_json
      ]
    );
  }

  for (const item of productSizes) {
    await run(
      'INSERT INTO product_sizes (product_id, size, stock_quantity) VALUES (?, ?, ?)',
      [item.product_id, item.size, item.stock_quantity]
    );
  }

  console.log(`Seed concluída com sucesso: ${products.length} produtos e ${productSizes.length} variações de tamanho.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error('Erro ao executar seed:', error);
  process.exit(1);
});
