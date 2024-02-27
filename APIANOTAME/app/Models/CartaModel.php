<?php namespace App\Models;

use CodeIgniter\Model;

class CartaModel extends Model {
    protected $table = 'carta';
    protected $primaryKey = 'id_carta';
    protected $allowedFields = [
        'carta_img',
        'id_empresa',
        'id_user',
    ];
}