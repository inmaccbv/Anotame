<?php namespace App\Models;

use CodeIgniter\Model;

class MenuUploadModel extends Model {
    protected $table = 'menu';
    protected $primaryKey = 'id_menu';
    protected $allowedFields = [
        'menu_img',
        'dia',
        'id_empresa',
        'id_user',
    ];
}