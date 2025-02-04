import permabrand_logo from "../assets/logo_black.svg"

const Navbar = () => {
  return (
    <div className="h-20 w-full px-20 flex items-center justify-between">
        <div className="flex items-center"><img src={permabrand_logo} alt="permabrand" className="h-12 w-12 text-[#212121] mr-2" /><h1 className="font-semibold text-3xl tracking-[3px]">PermaBrand</h1></div>
        <button className="px-2 py-1 text-[#212121] rounded-md border border-[#212121] hover:bg-[#212121] hover:text-white cursor-pointer">Connect Wallet</button>
    </div>
  )
}

export default Navbar
