import permabrand_logo from "../assets/logo_black.svg";

const NotFound = () => {
  return (
    <div className="h-[calc(100vh-5rem)] flex pt-[30vh] justify-center">
        <div className="flex h-20 items-center"><img src={permabrand_logo} alt="not found" className="h-8 md:h-12 mr-4" />
       <p>Brandkit not found</p> </div>
        
    </div>
  )
}

export default NotFound
