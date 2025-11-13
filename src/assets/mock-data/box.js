//?PISOS//
export const fakeData = [
{
  idSede: 1,
  piso: 1,
  imgPlanta: "assets/images/bg-images/box_1.svg",
  boxes: [
    {
      id: 1,
      nombre: "M1",
      idEstado: 1,
      positionTop: 64,
      positionLeft: 28,
      idServicio: 1
    },
    {
      id: 2,
      nombre: "M2",
      idEstado: 2,
      positionTop: 71.6,
      positionLeft: 41.6,
      idServicio: 1
    },
    {
      id: 3,
      nombre: "M3",
      idEstado: 1,
      positionTop: 41.6,
      positionLeft: 41.6,
      idServicio: 2
    }
  ]
},
{
  idSede: 1,
  piso: 2,
  imgPlanta: "assets/images/bg-images/box_2.svg",
  boxes: [
    {
      id: 1,
      nombre: "L1",
      idEstado: 2,
      positionTop: 64,
      positionLeft: 28,
      idServicio: 3
    },
    {
      id: 2,
      nombre: "L2",
      idEstado: 2,
      positionTop: 71.6,
      positionLeft: 41.6,
      idServicio: 3
    },
    {
      id: 3,
      nombre: "P1",
      idEstado: 2,
      positionTop: 58,
      positionLeft: 15,
      idServicio: 1
    },
    {
      id: 4,
      nombre: "P2",
      idEstado: 2,
      positionTop: 91.6,
      positionLeft: 21.6,
      idServicio: 1
    }
  ]
}
];

export const sedes = [
  {
    idSede: 1,
    nombre: "PUEBLO LIBRE",
    pisos: [1, 2, 3]
  },
  {
    idSede: 2,
    nombre: "MEGA PLAZA",
    pisos: [1, 2]
  },
  {
    idSede: 3,
    nombre: "SURCO",
    pisos: [1]
  }
]

export const listadoClientes = [
  {
    idSede: 1,
    piso: 1,
    listadoDeCLientes: [
      {
        idClinete: 1,
        nombre: "Juan Perez",
        idServicio: 1,
        box: 'M3',
        estadoCliente: 1,
        posicionEspera: 1
      },
      {
        idClinete: 1,
        nombre: "Diana Perez",
        idServicio: 1,
        box: 'M3',
        estadoCliente: 2,
        posicionEspera: 0
      },
      {
        
      }
    ]
  },
  {
    idSede: 1,
    piso: 2,
    listadoDeCLientes: []
  },
  {
    idSede: 1,
    piso: 3,
    listadoDeCLientes: []
  },
    {
    idSede: 2,
    piso: 1,
    listadoDeCLientes: []
  },
  {
    idSede: 2,
    piso: 2,
    listadoDeCLientes: []
  },
  {
    idSede: 3,
    piso: 1,
    listadoDeCLientes: []
  }
]

const listadoEsperaAntiguo = [
  {
    id: 1,
    nombre: "Juan Perez",
    idSede: 1,
    idServicio: 1,
    box: 'M3'
  },
  {
    id: 2,
    nombre: "Melissa Lopez",
    idSede: 1,
    idServicio: 1,
  },
  {
    id: 3,
    nombre: "Maria Gomez",
    idSede: 1,
    idServicio: 1,
  },
  {
    id: 4,
    nombre: "Jocelina Torres",
    idSede: 1,
    idServicio: 1,
  },
    {
    id: 4,
    nombre: "Carlos Ramirez",
    idSede: 2,
    idServicio: 5,
  }
]