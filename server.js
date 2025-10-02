const express = require('express');
const server = express();
const path = require('path');

server.use(express.json());
server.use(express.static(path.join(__dirname)));

const { obterPlantios } = require('./repositorio/bancoDados')
const { incluirPlantios } = require('./repositorio/bancoDados')
const { obterTotalMudas } = require('./repositorio/bancoDados')
const { obterIrrigacao } = require('./repositorio/bancoDados')
const { incluirIrrigacao } = require('./repositorio/bancoDados')
const { obterColheita } = require('./repositorio/bancoDados')
const { incluirColheita } = require('./repositorio/bancoDados')

// GET em '/plantio'
// localhost:3000/plantios
server.get('/plantios', async (req, res) =>{
    // Guarda a função: 'aguardar até que obterPlantios'
    const plantios = await obterPlantios();
    // Retorna o 'plantios'
    res.json(plantios);
})

// POST em '/plantio'
// localhost:3000/registrarPlantio
server.post('/registrarPlantio', async (req, res)=>{

    // Manda as características do 'plantio' para o 'body'
    const {Variedade, Data_Plantio, Quantidade_Plantada, Localizacao} = req.body;
    
    // Chama a função e aplica os parâmetros
    const resposta = await incluirPlantios(Variedade, Data_Plantio, Quantidade_Plantada, Localizacao);
    
    // Se quando for iniciado o server e for afetado as 'rows', deu bom
    if(resposta.affectedRows > 0){
        res.json({msg: 'Atualizado!'})
    }else{
        res.json({msg: 'Deu ruim ;-;'})
    }
    
})



// GET em '/mudas'
// localhost:3000/mudas
server.get('/mudas', async (req, res) =>{
        try {
            const { total_mudas, data_atualizacao } = await obterTotalMudas();
    
            res.json({
                total_mudas: total_mudas || 0,
                data_atualizacao: data_atualizacao || null
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ erro: "Erro ao obter total de mudas" });
        }
    });

// GET em '/irrigacao'
// localhost:3000/irrigacao
server.get('/irrigacao', async (req, res) =>{
    const irrigacao = await obterIrrigacao();

    res.json(irrigacao);
})

// POST em '/registrarIrrigacao'
//
server.post('/registrarIrrigacao', async (req, res) =>{
    const { ID_Plantio, Horario_Inicial, Horario_Final } = req.body;

    // Verifica se os valores estão definidos
    if (!ID_Plantio || !Horario_Inicial || !Horario_Final) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }

    try {
        const resposta = await incluirIrrigacao(ID_Plantio, Horario_Inicial, Horario_Final);

        if (resposta.affectedRows > 0) {
            res.json({ msg: 'Atualizado!' });
        } else {
            res.json({ msg: 'Erro ao registrar irrigação.' });
        }
    } catch (error) {
        console.error('Erro ao registrar irrigação:', error);
        res.status(500).json({ msg: 'Erro interno no servidor.' });
    }
});





// GET em '/Colheita'
// localhost:3000/colheita
server.get('/colheita', async (req, res) =>{
    const colheita = await obterColheita();

    res.json(colheita);
})



// POST em '/registrarColheita'
//
server.post('/registrarColheita', async (req, res) =>{
    const {ID_Plantio, Data_Colheita, Quantidade_Colhida, Qualidade} = req.body

    const resposta = await incluirColheita(ID_Plantio, Data_Colheita, Quantidade_Colhida, Qualidade);

    // Se quando for iniciado o server e for afetado as 'rows', deu bom
    if(resposta.affectedRows > 0){
        res.json({msg: 'Atualizado!'})
    }else{
        res.json({msg: 'Deu ruim ;-;'})
    }
})







// Base da definição de função: ()=>{}
server.listen(3000, ()=>{
    console.log('Servidor OnLine!')
});
