import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children}) => {

  const handleHello = () => {
    const message = createChatBotMessage('Hola!. Un gusto saludarte.');
    updateChatbotState(message);
  };

  const handleQuestion = (faqs) => {
    const message = createChatBotMessage(
      "Selecciona una opción",
      {
        widget: "dynamicOptions",
        props: {
          faqs: faqs,
        },
        payload: faqs,
      }
    );
    updateChatbotState(message);
  }


  const handleAnswer = (faqs, id) => {
    const message = createChatBotMessage(
      faqs,
    {
      widget: "feedback",
      props: {
        faqs: faqs,
        id: id,
      },
      payload: id,
    })
    console.log(message)
    
    updateChatbotState(message);
  }

  
  const handleToHome = (faqs) => {
    const message = createChatBotMessage(
      faqs,
    {
      widget: "learningOptions",
      props: {
        faqs: faqs,
      }
    })
    updateChatbotState(message);
  }

  // const handleAvailableCourse = () => {
  //   const message = createChatBotMessage(
  //     'Para ver los cursos disponibles deberas ingresar a la seccion "Ver Cursos". Alli en contrara una lista de los proximos cursos a lanzarse, los que estan en curso, y los que quedaron con cupos agotados.',
  //   {
  //     widget: "learningOptions",
  //   })
  //   updateChatbotState(message);
  // }

  // const handleInfoCourse = () => {
  //   const message = createChatBotMessage(
  //     'Para obtener mas informacion respecto a un curso de su interes, dirigase a "Ver Cursos" y haga click en el boton "Ver Curso" del curso que desee. Alli encontrara informacion detallada del curso, horarios, el docente, que vas aprender, modalidad del cursado y mas. Tambien podes contactarte con nosotros atraves de wsp haciendo click en el boton "Contacto y atención al cliente""',
  //   {
  //     widget: 'learningOptions',
  //   })
  //   updateChatbotState(message);
  // }

  // const handleScheduleCourse = () => {
  //   const message = createChatBotMessage(
  //     'Para ver los horarios de un curso deberas ingresar a la seccion "Ver Cursos". Alli en contrara una lista de los proximos cursos a lanzarse, los que estan en curso, y los que quedaron con cupos agotados. Haciendo click en el boton "Ver Curso" del curso que desee, podra ver los horarios del mismo.',
  //   {
  //     widget: "learningOptions",
  //   })
  //   updateChatbotState(message);
  // }

  // // Pagos y Facturacion 
  // const handlePaymentAndBilling = () => {
  //   const message = createChatBotMessage(
  //     "Selecciona una opción",
  //   {
  //     widget: 'paymentOptions'
  //   })
  //   updateChatbotState(message);
  // }
  


  // const handlePaymentAndBillingOptions = (id) => {

  //   if(id === 1) {
  //     console.log('hola');
  //     const message = createChatBotMessage(
  //       "Cuando hagas click en pagar curso te encontraras con una ventana de mercadopago en donde podras pagar con Tarjeta de crédito en hasta 12 cuotas sin interés. También podes pagar con tarjeta de débito, en efectivo en puntos de pago o con dinero disponible en Mercado Pago.",
  //       {
  //         widget: 'paymentOptions'
  //       })
  //       updateChatbotState(message);
  //   }

  //   if(id === 2) {
  //     const message = createChatBotMessage(
  //       "Por el momento no se puede pagar en cuotas, muy pronto agregaremos esa funcionalidad. Lo sentimos.",
  //       {
  //         widget: 'paymentOptions'
  //       })
  //       updateChatbotState(message);
  //   }

  //   if(id === 3) {
  //     const message = createChatBotMessage(
  //        "Si, al pagar un curso te llegara un mail con el comprobante de pago.",
  //       {
  //         widget: 'paymentOptions'
  //       })
  //       updateChatbotState(message);
  //   }

  //   if(id === 4) {
  //     const message = createChatBotMessage(
  //       "Por el momento no se puede pagar en cuotas, muy pronto agregaremos esa funcionalidad. Lo sentimos.",
  //       {
  //         widget: 'paymentOptions'
  //       })
  //       updateChatbotState(message);
  //   }

  // }


  const updateChatbotState = (message) => {
    // NOTICE: This function is set in the constructor, and is passed in from the top level Chatbot component. The setState function here actually manipulates the top level state of the Chatbot, so it's important that we make sure that we preserve the previous state.

    setState((prev) => ({
    ...prev,
    messages: [...prev.messages, message],
  }));
}



  

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleQuestion,
            handleAnswer,
            handleToHome,
            //handleInscription,
            //handleAvailableCourse,
            //handleInfoCourse,
            //handleScheduleCourse,
            //handlePaymentAndBilling,
            //handlePaymentAndBillingOptions,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider; 