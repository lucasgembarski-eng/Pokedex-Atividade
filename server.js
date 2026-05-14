const express = require('express');
const axios = require('axios');
const path = require('path');
const { pseudoRandomBytes } = require('crypto');

const app = express();
const PORT = 3000;

// Correções: app.use em vez de app.get.arguments e __dirname em vez de _dirname
app.use(express.static(path.join(__dirname, "public")));

// Correção: Removido o parêntese extra depois do 'res'
app.get('/api/pokemon/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
        const response = await axios.get(url);
        const pokemon = response.data;

        const dados = {
            nome: pokemon.name,
            id: pokemon.id,
            tipos: pokemon.types.map((t) => t.type.name),
            altura: pokemon.height / 10 + ' m',
            // Correção: weight
            peso: pokemon.weight / 10 + ' kg', 
            imagem: pokemon.sprites.other['official-artwork'].front_default,
            // Correção: abilities e a.ability.name
            habilidades: pokemon.abilities.map((a) => a.ability.name),
        };

        // Correção: res.json em vez de res,json
        res.json(dados);

    } catch (error) {
        // Correção: error.response em vez de error.resonse
        if (error.response && error.response.status === 404) {
            res.status(404).json({ erro: 'Pokemon nao encontrado!.' });
        } else {
            // Dica extra: Quando é um erro de conexão geral, o ideal é retornar o status 500 (Erro de Servidor)
            res.status(500).json({ erro: 'Erro ao conectar com a PokeApi.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});