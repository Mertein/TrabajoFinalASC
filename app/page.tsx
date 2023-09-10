import NavBar from './components/NavBar/navBar';
import Slider from './components/Slider/slider'
import Hero from './components/Hero/hero'
import SliderData from './components/Slider/sliderData';
import getCurrentUser from './actions/getCurrentUser';

export default async function Home() {
  const currentUser = await getCurrentUser();
  return (
      <>
        <NavBar user={currentUser}/>
        <Hero heading={'Bienvenidos a Academia A.L'} message={'Que Alegria verte!'} ></Hero>
        <Slider slides={SliderData}></Slider>

      </>
  )
}