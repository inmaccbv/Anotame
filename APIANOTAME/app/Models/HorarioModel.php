<?php

namespace App\Models;

use CodeIgniter\Model;

class HorarioModel extends Model {
    protected $table = 'horarios';
    protected $primaryKey = 'id_horario';
    protected $allowedFields = [
        'dia',
        'hora_apertura',
        'hora_cierre',
        'id_user',
        'id_empresa'
    ];
}