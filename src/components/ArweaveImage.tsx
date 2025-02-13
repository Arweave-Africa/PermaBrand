const ArweaveImage = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className="h-full w-full" />;
};

export default ArweaveImage;
