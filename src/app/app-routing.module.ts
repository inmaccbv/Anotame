import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'detallescliente',
    loadChildren: () => import('./pages/detallescliente/detallescliente.module').then( m => m.DetallesclientePageModule)
  },
  {
    path: 'reservas',
    loadChildren: () => import('./pages/reservas/reservas.module').then( m => m.ReservasPageModule)
  },
  {
    path: 'reservascli',
    loadChildren: () => import('./pages/reservascli/reservascli.module').then( m => m.ReservascliPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./pages/reviews/reviews.module').then( m => m.ReviewsPageModule)
  },
  {
    path: 'reviewscli',
    loadChildren: () => import('./pages/reviewscli/reviewscli.module').then( m => m.ReviewscliPageModule)
  },
  {
    path: 'seleccion-empresa',
    loadChildren: () => import('./pages/seleccion-empresa/seleccion-empresa.module').then( m => m.SeleccionEmpresaPageModule)
  },
  {
    path: 'logincli',
    loadChildren: () => import('./pages/logincli/logincli.module').then( m => m.LogincliPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'logoutcli',
    loadChildren: () => import('./pages/logoutcli/logoutcli.module').then( m => m.LogoutcliPageModule)
  },
  {
    path: 'menu-img',
    loadChildren: () => import('./pages/menu-img/menu-img.module').then( m => m.MenuImgPageModule)
  },
  {
    path: 'menu-imgcli',
    loadChildren: () => import('./pages/menu-imgcli/menu-imgcli.module').then( m => m.MenuImgcliPageModule)
  },
  
  {
    path: 'perfilcli',
    loadChildren: () => import('./pages/perfilcli/perfilcli.module').then( m => m.PerfilcliPageModule)
  },
  {
    path: 'lista-reservas',
    loadChildren: () => import('./pages/lista-reservas/lista-reservas.module').then( m => m.ListaReservasPageModule)
  },
  {
    path: 'lista-reservascli',
    loadChildren: () => import('./pages/lista-reservascli/lista-reservascli.module').then( m => m.ListaReservascliPageModule)
  },
  {
    path: 'listacli',
    loadChildren: () => import('./pages/listacli/listacli.module').then( m => m.ListacliPageModule)
  },
  {
    path: 'listaempr',
    loadChildren: () => import('./pages/listaempr/listaempr.module').then( m => m.ListaemprPageModule)
  },
  {
    path: 'homecli',
    loadChildren: () => import('./pages/homecli/homecli.module').then( m => m.HomecliPageModule)
  },
  {
    path: 'horarios',
    loadChildren: () => import('./pages/horarios/horarios.module').then( m => m.HorariosPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'gestion-reservas',
    loadChildren: () => import('./pages/gestion-reservas/gestion-reservas.module').then( m => m.GestionReservasPageModule)
  },
  {
    path: 'gestion-reservascli',
    loadChildren: () => import('./pages/gestion-reservascli/gestion-reservascli.module').then( m => m.GestionReservascliPageModule)
  },
  {
    path: 'gestion-sala',
    loadChildren: () => import('./pages/gestion-sala/gestion-sala.module').then( m => m.GestionSalaPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./pages/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: 'contactocli',
    loadChildren: () => import('./pages/contactocli/contactocli.module').then( m => m.ContactocliPageModule)
  },
  {
    path: 'descripcion-cliente',
    loadChildren: () => import('./pages/descripcion-cliente/descripcion-cliente.module').then( m => m.DescripcionClientePageModule)
  },
  {
    path: 'descripcion-local',
    loadChildren: () => import('./pages/descripcion-local/descripcion-local.module').then( m => m.DescripcionLocalPageModule)
  },
  {
    path: 'detalles-popover',
    loadChildren: () => import('./pages/detalles-popover/detalles-popover.module').then( m => m.DetallesPopoverPageModule)
  },
  {
    path: 'gestion-menu-carta',
    loadChildren: () => import('./pages/gestion-menu-carta/gestion-menu-carta.module').then( m => m.GestionMenuCartaPageModule)
  },
  {
    path: 'carta',
    loadChildren: () => import('./pages/carta/carta.module').then( m => m.CartaPageModule)
  },
  {
    path: 'cartacli',
    loadChildren: () => import('./pages/cartacli/cartacli.module').then( m => m.CartacliPageModule)
  },
  {
    path: 'codigo-qr',
    loadChildren: () => import('./pages/codigo-qr/codigo-qr.module').then( m => m.CodigoQrPageModule)
  },
  {
    path: 'registrocli',
    loadChildren: () => import('./pages/registrocli/registrocli.module').then( m => m.RegistrocliPageModule)
  },
  {
    path: 'registroempresa',
    loadChildren: () => import('./pages/registroempresa/registroempresa.module').then( m => m.RegistroempresaPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'listauser',
    loadChildren: () => import('./pages/listauser/listauser.module').then( m => m.ListauserPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'addempresa',
    loadChildren: () => import('./pages/addempresa/addempresa.module').then( m => m.AddempresaPageModule)
  },
  {
    path: 'addempleados',
    loadChildren: () => import('./pages/addempleados/addempleados.module').then( m => m.AddempleadosPageModule)
  },
  {
    path: 'config-empleados',
    loadChildren: () => import('./pages/config-empleados/config-empleados.module').then( m => m.ConfigEmpleadosPageModule)
  },
  {
    path: 'listauser',
    loadChildren: () => import('./pages/listauser/listauser.module').then( m => m.ListauserPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrocli',
    loadChildren: () => import('./pages/registrocli/registrocli.module').then( m => m.RegistrocliPageModule)
  },
  {
    path: 'registroempresa',
    loadChildren: () => import('./pages/registroempresa/registroempresa.module').then( m => m.RegistroempresaPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  },  
  
 
 
   
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
