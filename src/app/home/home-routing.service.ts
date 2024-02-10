
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosComponent } from './pedidos/pedidos.component';
import { AgregarPedidoComponent } from './agregar-pedido/agregar-pedido.component';
import { ClientesComponent } from './clientes/clientes.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MenuComponent } from './menu/menu.component';

const routes : Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: MenuComponent
  },
  {
    path: 'pedidos',
    component: PedidosComponent
  },
  {
    path: 'agregar_pedido',
    component: AgregarPedidoComponent
  },{
    path:'clientes',
    component:ClientesComponent
  },{
    path: 'medicos',
    component: MedicosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
