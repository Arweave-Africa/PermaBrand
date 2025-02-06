
const Hero = () => {
  return (
    <section className='w-full h-[60vh] lg:h-[calc(100vh-5rem)] 2xl:h-[70vh]'>
			<div className='w-full md:max-w-3xl xl:max-w-5xl container mx-auto flex flex-col items-center justify-center h-full relative px-4'>
				<h1 className='text-4xl md:text-5xl  xl:text-7xl font-bold text-center  mb-6 leading-snug  md:leading-snug xl:leading-normal'>
					Explore and Share 
					<span className='text-primary'>Arweave Brand Kits</span>
				</h1>
				<p className='text-lg md:text-2xl xl:text-3xl  text-gray leading-snug md:leading-relaxed xl:leading-normal px-8'>
          Upload and showcase your brand assets to <br /> connect with the
          <strong className='text-primary'>Arweave ecosystem</strong>
				</p>
				<div
					className='
				bg-primary hover:bg-transparent border-2 border-primary  hover:text-primary
				cursor-pointer text-md font-medium p-2 px-8 rounded-lg transition-all duration-300 md:hidden mt-8'
				>
					View Gallery
				</div>
			</div>
		</section>
  )
}

export default Hero;
