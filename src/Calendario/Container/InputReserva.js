import React, { Component } from 'react';
import ModalContainer from '../../widgets/container/modal-container.js'
import ModalReserva from '../Components/ModalReserva.js'
import { firebaseApp } from '../../index.js'
import './InputReserva.css'
import swal from 'sweetalert';



export class InputReserva extends Component {
   state = {
     reservados: [],
     modalVisible: false,
     fechaReserva:'',
     horaInicio:'',
     horaFin:'',
     poblacion:'',
     direccion:'',
     motivoReunion:'',
     tituloReserva:'',
     dia:this.props.dia,
     mes:this.props.mes,
     year:this.props.year,
   }

   handleChange = (event) => {
     const target = event.target
     const value = target.value
     const id =  target.id
     this.setState({
       [id]:value
     })

   }

   handleClickModalReserva = () => {
     const { horaReserva } = this.props
     const { year , mes , dia } = this.state
      const horaNumero  = parseInt(horaReserva,10)
      const horaSuma = horaNumero + 1

      if (horaSuma === 9) {
        this.setState({
          horaFin:`0${horaSuma}:00`
        })
      }
      else {
        this.setState({
          horaFin:`${horaSuma}:00`
        })

      }

     this.setState({
       modalVisible: true,
       horaInicio: horaReserva,
       fechaReserva: `${year}-${mes}-${dia}`
     })
   }

   handleClickCloseModal = () => {
     this.setState({
       modalVisible: false
     })
   }

   static getDerivedStateFromProps = (props, state) => {
     return props

   }


   handleClickGuardarReserva = (event) => {
     const ref  = firebaseApp.database().ref('usuarios')
     const user = firebaseApp.auth().currentUser;
     const {
       horaInicio ,
       horaFin ,
      fechaReserva ,
      tituloReserva,
      motivoReunion ,
      direccion ,
      poblacion
    } = this.state
     const nombreReunion = this.state.tituloReserva
     const nuevaReunion = {
          [nombreReunion] : {
          tituloReserva: tituloReserva,
          fechaReserva:fechaReserva,
          horaInicio:horaInicio,
          horaFin:horaFin,
          motivoReunion:motivoReunion,
          direccion: direccion,
          poblacion: poblacion
        }
     }

   ref.child(user.uid).child('reuniones').update(nuevaReunion)
     swal('La Reserva ha sido Guardada')
     this.setState({
       modalVisible:false
     })
   }

   componentDidMount = () => {
     const ref  = firebaseApp.database().ref('usuarios')
     const user = firebaseApp.auth().currentUser;
     const listaReunionesBaseDatos = []
     ref.child(user.uid).child('reuniones').on('child_added', (sanpshot) => {
     listaReunionesBaseDatos.push(sanpshot.val())
     this.setState({
      reservados:listaReunionesBaseDatos,
      })
    })

  }

   tipoCss = () => {
      
      const { year,mes,dia, reservados  } = this.state
      const { horaReserva } = this.props
      const fecha = []
      const tituloReserva = []
      for (let i = 0; i < reservados.length; i++) {
          const titulo = reservados[i].tituloReserva
          const fechaInicio = reservados[i].fechaReserva
          const hora = reservados[i].horaInicio
          fecha.push(`${fechaInicio} ${hora}`)
          tituloReserva.push(titulo)
        
      }
    return fecha.length >= 1 ?  
          fecha.map((reserva, i) => {                   
     return  reserva === `${year}-${mes}-${dia} ${horaReserva}` ?
             <td className='ocupadoReserva'>
             <p>{tituloReserva[i]}</p>
              <button onClick={this.verOcupado} className="btn btn-link  btn-block">Ocupado</button>
             </td>
             :
             <td className={'libre'}>
             <button onClick={this.handleClickModalReserva} className="btn btn-link  btn-block">Reservar</button>
            </td>
     })
     :
      <td className={'libre'}>
      <button onClick={this.handleClickModalReserva} className="btn btn-link  btn-block">Reservar</button>
     </td>
    
   }




   verOcupado = () => {
     alert('Hola')
   }


   render() {
  
     const { horaInicio , horaFin ,  fechaReserva, } = this.state
     return (
     this.state.modalVisible ?
     <ModalContainer>
       <ModalReserva
        handleClickCloseModal={this.handleClickCloseModal}
        handleChange={this.handleChange}
        horaInicio={horaInicio}
        horaFin={horaFin}
        fechaReserva={fechaReserva}
        handleClickGuardarReserva={this.handleClickGuardarReserva}
       />
     </ModalContainer>
     :
      this.tipoCss() 
     )
   }
}
