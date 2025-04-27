const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const os = require('os');
const authenticateToken = require('../middleware/authJWT');

// Configuração de caminhos
const DATA_DIR = path.join(__dirname, '../data');
const STATUS_FILE = path.join(DATA_DIR, 'systemStatus.json');

// Garantir que o diretório e arquivo existam
const initializeSystemFiles = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log(`📂 Diretório criado: ${DATA_DIR}`);
    }

    if (!fs.existsSync(STATUS_FILE)) {
      const initialStatus = {
        isLocked: false,
        message: 'Sistema operacional normal',
        createdAt: new Date().toISOString()
      };
      fs.writeFileSync(STATUS_FILE, JSON.stringify(initialStatus, null, 2));
      console.log(`📄 Arquivo de status criado: ${STATUS_FILE}`);
    }
  } catch (err) {
    console.error('❌ Erro ao inicializar arquivos do sistema:', err);
    throw err;
  }
};

// Carregar status do sistema
const loadSystemStatus = () => {
  try {
    initializeSystemFiles();
    const data = fs.readFileSync(STATUS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Erro ao carregar status do sistema:', err);
    return {
      isLocked: false,
      message: 'Sistema operacional normal',
      createdAt: new Date().toISOString()
    };
  }
};

// Salvar status do sistema
const saveSystemStatus = (status) => {
  try {
    initializeSystemFiles();
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
    return true;
  } catch (err) {
    console.error('❌ Erro ao salvar status do sistema:', err);
    return false;
  }
};

// Formatar tempo de atividade
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${mins}m ${secs}s`;
};

// Rotas
router.get('/status', authenticateToken, (req, res) => {
  res.json(loadSystemStatus());
});

router.get('/stats', authenticateToken, (req, res) => {
  try {
    const stats = {
      cpu: {
        load1: os.loadavg()[0].toFixed(2),
        load5: os.loadavg()[1].toFixed(2),
        load15: os.loadavg()[2].toFixed(2),
        usage: (os.loadavg()[0] / os.cpus().length * 100).toFixed(2) + '%'
      },
      memory: {
        total: (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB',
        free: (os.freemem() / (1024 ** 3)).toFixed(2) + ' GB',
        usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2) + '%'
      },
      uptime: formatUptime(os.uptime()),
      status: 'online',
      timestamp: new Date().toISOString()
    };
    res.json(stats);
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas do sistema' });
  }
});

// router.post('/toggle-lock', authenticateToken, (req, res) => {
//   try {
//     if (req.user.levelAuth !== 'Dev') {
//       return res.status(403).json({ error: 'Acesso negado: requer nível Dev' });
//     }

//     const currentStatus = loadSystemStatus();
//     const newStatus = {
//       isLocked: !currentStatus.isLocked,
//       message: req.body.message || 
//               (currentStatus.isLocked ? 'Sistema liberado' : 'Sistema em manutenção'),
//       updatedBy: req.user.usuario,
//       updatedAt: new Date().toISOString()
//     };

//     if (saveSystemStatus(newStatus)) {
//       res.json(newStatus);
//     } else {
//       res.status(500).json({ error: 'Falha ao salvar status do sistema' });
//     }
//   } catch (error) {
//     console.error('❌ Erro ao alternar bloqueio:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

module.exports = router;