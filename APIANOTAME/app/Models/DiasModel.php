<?php namespace App\Models;

use CodeIgniter\Model;

class DiasModel extends Model {
    protected $table = 'dias';
    protected $primaryKey = 'id_dia';
    protected $allowedFields = [
        'id_dia',
        'dia'
    ];
}