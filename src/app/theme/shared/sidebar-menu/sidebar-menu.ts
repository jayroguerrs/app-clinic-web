import { paths as p } from "../../../../commons/routes";

export const sidebar_menu: Array<MenuItem> = [
    {
        "idMenu": 104,
        "idPadre": 1,
        "title": p.marketing.origin,
        "idMenuTipo": null,
        "icon": "fa fa-table",
        "url": "",
        "id": p.marketing.origin,
        "visible": true,
        "nivel": 0,
        "type": "collapse",
        "children": [
            {
                "idMenu": 105,
                "idPadre": 104,
                "title": "Mapeo - RRSS",
                "idMenuTipo": null,
                "icon": "fa fa-table",
                "url": `${p.marketing.origin}/${p.marketing.mapeoRRSS}`,
                "id": p.marketing.mapeoRRSS,
                "visible": true,
                "nivel": 0,
                "type": "item",
                "children": [],
                "seleccionado": false,
                "privilegios": [],
                "idPerfilRoles": [11, 14, 8, 7],
                "estado": true,
            },
            {
                "idMenu": 106,
                "idPadre": 104,
                "title": "Source",
                "idMenuTipo": null,
                "icon": "fa fa-table",
                "url": `${p.marketing.origin}/${p.marketing.source}`,
                "id": p.marketing.source,
                "visible": true,
                "nivel": 0,
                "type": "item",
                "children": [],
                "seleccionado": false,
                "privilegios": [],
                "idPerfilRoles": [11, 14, 8, 7],
                "estado": true,
            },
            {
                "idMenu": 107,
                "idPadre": 104,
                "title": "Campaing",
                "idMenuTipo": null,
                "icon": "fa fa-table",
                "url": `${p.marketing.origin}/${p.marketing.campaing}`,
                "id": p.marketing.campaing,
                "visible": true,
                "nivel": 0,
                "type": "item",
                "children": [],
                "seleccionado": false,
                "privilegios": [],
                "idPerfilRoles": [11, 14, 8, 7],
                "estado": true,
            },
        ],
        "seleccionado": false,
        "privilegios": [],
        "idPerfilRoles": [11, 14, 8, 7],
        "estado": true,
    },
];

export interface MenuItem {
  idMenu: number;
  idPadre: number | null;
  title: string;
  idMenuTipo: number | null;
  icon: string | null;
  url: string | null;
  id: string;
  visible: boolean;
  nivel: number;
  type: 'group' | 'collapse' | 'item';
  children: MenuItem[];
  seleccionado: boolean;
  privilegios: any[];
  idPerfilRoles: number[];
  estado?: boolean;
}