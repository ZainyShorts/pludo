const TextComponent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] md:h-[80vh] text-center bg-gradient-to-br from-blue-300 via-purple-300  to-slate-200 ">
        <p className="text-5xl md:text-6xl w-[90%] p-2 md:w-[60%] text-center font-bold text-black mb-6">
          At Pluto, our goal is to turn work into play.
        </p>
        <p className="text-3xl md:text-5xl mt-8 w-[90%] p-2 md:w-[60%] text-center font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          With fun-to-use digital assistants, that do work for you, on demand.
        </p>
      </div>
    );
  };
  
  export default TextComponent;
  