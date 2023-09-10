import React, {useState, useRef} from "react";
import "./LearningOptions.css";
import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";

const LearningOptions =  (props) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showThanksMessage, setShowThanksMessage] = useState(false)
  const messagesContainerRef = useRef(null);
  const [like, setLike] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null); 

  const scrollToBottom = () => {
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
  };
    
  const handleDislikeClick = async (id) => {
    setShowFeedback(true);
    setShowThanksMessage(false);
    setLike(false);
    setTimeout(() => {
      scrollToBottom();
    }, 100); // 
    try {
      const response = await axios.post("/api/feedback", {
        feedback: feedbackText,
        isLike : false,
        faqId: id,
      });
      console.log("response", response)
    } catch (error) {
      return error;
    }
    setFeedbackText("");
  };
 
  const handleLikeClick =  async (id) => {
    console.log("idLike", id)
    setShowFeedback(false);
    setShowThanksMessage(true);
    setTimeout(() => {
      scrollToBottom();
    }, 100); // 
    try {
      const response = await axios.post("/api/feedback", {
        feedback: feedbackText,
        isLike : true,
        faqId: id,
      });
    } catch (error) {
    }
    setShowFeedback(false);
    setFeedbackText("");
  };

  const handleReturnToHomeClick =  async () => {
    setShowFeedback(false);
    setShowThanksMessage(false);
    props.actionProvider.handleToHome("¿En qué puedo ayudarte?");
  };

  const submitFeedback = async (id) => {
    try {
      const response = await axios.post("/api/feedback", {
        feedback: feedbackText,
        isLike : false,
        faqId: id,
      });
      console.log('Response',response)
    } catch (error) {
      console.log('Error', error)
    }
    setShowFeedback(false);
    setFeedbackText("");
    setShowThanksMessage(true);
  };

  const {faqsCategories, faqs} = props;
  const filterCategories = faqsCategories? faqsCategories.filter((category) => category.category === props.categories) : [];
  // if(filterCategories.length > 0){
  //   const optionsFilter = faqs.filter((faq) => faq.category === filterCategories[0]);
  //   const options = optionsFilter.map((option) => (
  //     <button
  //       className="learning-option-button"
  //       key={option.id}
  //       onClick={option.handler}
  //     >
  //       {option.question}
  //     </button>
      
  //   ));
  //   return <div className="learning-options-container">{options}</div>;
  // }

  const optionsGeneral = [
    { text: "Cursos", handler: () => props.actionProvider.handleQuestion(), id: 1 },
    { text: "Pagos y Facturación", handler: props.actionProvider.handlePaymentAndBilling, id: 2 },
    { text: "Certificación", handler: props.actionProvider.handleCertification , id: 3 },
    { text: "Contacto y Atención al Cliente", handler: props.actionProvider.handleContactAndCustomerService , id: 4}
  ];

  const optionsCourses = [
    { text: "¿Como me Inscribo?", handler: props.actionProvider.handleInscription, id: 1 },
    { text: "¿Donde ver los cursos Disponbiles?", handler: props.actionProvider.handleAvailableCourse, id: 2 },
    { text: "¿Como puedo obtener mas informacion sobre los curso?", handler: props.actionProvider.handleInfoCourse , id: 3 },
    { text: "Horarios y Duración de los Cursos", handler: props.actionProvider.handleScheduleCourse, id: 4 },
  ];
  if(props.type){
    const faqsDynamic = faqs.filter((faq) => faq.category === props.type);
    const optionsGeneral = faqsDynamic.map((faq) => ([
      { text: faq.question, handler: () => props.actionProvider.handleAnswer(faq.answer, faq.id), id: faq.id }
    ]));
    const options = optionsGeneral.map((option) => (
      <button
        className="learning-option-button"
        key={option[0].id}
        onClick={option[0].handler}
      >
        {option[0].text}
      </button>
    ));
    return <div className="learning-options-container">{options}</div>;
  }

  const optionsPayloadAndBilling = [
    { text: "¿Con que metodo de pagos se puede pagar?", handler: () => props.actionProvider.handlePaymentAndBillingOptions(1), id: 1 },
    { text: "¿Se puede pagar en cuotas?", handler: () => props.actionProvider.handlePaymentAndBillingOptions(2), id: 2 },
    { text: "¿Me dan un un comprobante de pago al pagar un curso?", handler: () => props.actionProvider.handlePaymentAndBillingOptions(3) , id: 3 },
    { text: "¿En caso de arrepentirme, puedo solicitar un reembolso?", handler: () => props.actionProvider.handlePaymentAndBillingOptions(4), id: 4 },
  ];

  const optionsCertification = [
    { text: "¿Como me Inscribo?", handler: props.actionProvider.handleInscription, id: 1 },
    { text: "¿Donde ver los cursos Disponbiles?", handler: props.actionProvider.handleAvailableCourse, id: 2 },
    { text: "¿Como puedo obtener mas informacion sobre los cursos?", handler: props.actionProvider.handleInfoCourse , id: 3 },
    { text: "¿Horarios y Duración de los Cursos?", handler: props.actionProvider.handleScheduleCourse, id: 4 },
  ];

  const optionsContactAndCustomerService = [
    { text: "¿Como me Inscribo?", handler: props.actionProvider.handleInscription, id: 1 },
    { text: "¿Donde ver los cursos Disponbiles?", handler: props.actionProvider.handleAvailableCourse, id: 2 },
    { text: "¿Como puedo obtener mas informacion sobre los cursos?", handler: props.actionProvider.handleInfoCourse , id: 3 },
    { text: "¿Horarios y Duración de los Cursos?", handler: props.actionProvider.handleScheduleCourse, id: 4 },
  ];

  const optionsGeneralDynamic = faqsCategories ?  faqsCategories.map((faq, id) => ([
    { text: faq.category, handler: () => props.actionProvider.handleQuestion(faq.category), id: id }
  ])) : null;

  if(props.categories === "Categories"){  
  const options = optionsGeneralDynamic ?  optionsGeneralDynamic.map((option) => (
    <button
      className="learning-option-button"
      key={option[0].id}
      onClick={option[0].handler}
    >
      {option[0].text}
    </button>
  )) : null;
  return <div className="learning-options-container">{options}</div>;
  };

  if (props.categories === "feedback") {
    //console.log("feedback",props.payload) // tiene el id del faq
    return (
      <div className="learning-options-container" ref={messagesContainerRef}>
        <Button
          variant="outlined"
          color="secondary"
          className="bg-green-200 text-black m-1 p-1"
          onClick={() => handleLikeClick(props.payload)}
        >
          Me sirvió
        </Button>
        <Button
          variant="outlined"
          color="error"
          className="bg-red-200 text-black m-1 p-1"
          onClick={() => handleDislikeClick(props.payload)}
        >
          No me sirvió
        </Button>
        <Button
          variant="outlined"
          color="warning"
          className="text-black bg-yellow-200 m-1 p-1"
          onClick={() => handleReturnToHomeClick()}
        >
          Volver al Inicio
        </Button>
        {showThanksMessage && (
            <Typography variant="h6" gutterBottom style={{ marginTop: "20px", fontSize: "1.5rem", fontWeight: "bold" }}>
            ¡Gracias por tu aporte!
          </Typography>
        )}
        {showFeedback && (
          <div className="feedback-input" >
             <Typography variant="h6" gutterBottom style={{ marginTop: "20px", fontSize: "1.5rem", fontWeight: "bold" }}>
                ¿Porque no te sirvio?
              </Typography>
              <Typography variant="h6" gutterBottom style={{  fontSize: "1rem" }}>
               Su comentario nos ayudaria mucho para mejorar.
              </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Escribe tu comentario aquí sobre lo que te gustaría que agreguemos o mejoremos."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              style={{ border: "8px solid #ccc", borderRadius: "5px" }} // Estilos personalizados aquí
              InputProps={{ style: { color: "black" } }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => submitFeedback(props.payload)}
            >
              Enviar
            </Button>
          </div>
        )}
      </div>
    );
  }
}


export default LearningOptions;


