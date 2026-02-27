import permabrand_logo from "../assets/logo_black.svg";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-[calc(100vh-5rem)] flex pt-[30vh] justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 items-center">
          <img src={permabrand_logo} alt="not found" className="h-8 md:h-12 mr-4" />
          <p>Brandkit not found</p>
        </div>
        <Link
          to="/"
          className="rounded-full border border-[#D5D5D5] bg-white px-4 py-1.5 text-sm font-[500] text-[#212121] transition hover:border-[#9CA3AF]"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFound
