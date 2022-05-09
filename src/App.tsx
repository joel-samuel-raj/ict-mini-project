import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { useEffect, useState } from "react"

const ffmpeg = createFFmpeg( { log: true } )

function App () {
  const [ loading, setLoading ] = useState( false )
  const [ video, setVideo ] = useState<any>( null )
  const [ iFrame, setIframe ] = useState<any>( null )
  const [ pFrame, setPframe ] = useState<any>( null )
  const [ bFrame, setBframe ] = useState<any>( null )


  const loadFFMPEG = async () => {
    await ffmpeg.load()
    setLoading( true )
  }

  useEffect( () => {
    loadFFMPEG()
  }, [] )

  const run = async () => {
    ffmpeg.FS( "writeFile", "input.mp4", await fetchFile( video ) )
    await ffmpeg.run( "-i", "input.mp4", "-vf", "select='eq(pict_type, I)'", "-vsync", "vfr", "-f", "mp4", "i.mp4" )
    await ffmpeg.run( "-i", "input.mp4", "-vf", "select='eq(pict_type, P)'", "-vsync", "vfr", "-f", "mp4", "p.mp4" )
    await ffmpeg.run( "-i", "input.mp4", "-vf", "select='eq(pict_type, B)'", "-vsync", "vfr", "-f", "mp4", "b.mp4" )
    const data1 = ffmpeg.FS( "readFile", "i.mp4" )
    const data2 = ffmpeg.FS( "readFile", "p.mp4" )
    const data3 = ffmpeg.FS( "readFile", "b.mp4" )
    console.log(data1.buffer)
    console.log(data2.buffer)
    console.log(data3.buffer)
    const url1 = URL.createObjectURL( new Blob( [ data1.buffer ], { type: "video/mp4" } ) )
    const url2 = URL.createObjectURL( new Blob( [ data2.buffer ], { type: "video/mp4" } ) )
    const url3 = URL.createObjectURL( new Blob( [ data3.buffer ], { type: "video/mp4" } ) )
    setIframe(url1)
    setPframe(url2)
    setBframe(url3)
  }

  return loading === true ? (
    <div className="px-20 py-12">
      <h1 className="text-2xl text-center m-4"> ICT MINI PROJECT </h1>
      <h2 className="text-xl text-center m-4"> Intraframe compression using P frame, I frame, B frame </h2>
      <input className="block" type="file" onChange={ ( e ) => setVideo( e.target.files?.item( 0 ) ) } />
      <div className="flex m-4 justify-center">
        { video && ( <video className="w-1/2" controls src={ URL.createObjectURL( video ) }>
        </video> ) }
      </div>
      <div className="flex m-4 justify-center">
        { iFrame && ( <div className="w-1/3 m-4">
          <p className="text-center"> I Frame </p>
          <video controls src={ iFrame }>
        </video> 
        </div>) }
        { bFrame && ( <div className="w-1/3 m-4">
          <p className="text-center"> B Frame </p>
          <video controls src={ bFrame }>
        </video> 
        </div>) }
        { pFrame && ( <div className="w-1/3 m-4">
          <p className="text-center"> P Frame </p>
          <video  controls src={ pFrame }>
        </video> 
        </div>) }
      </div>
      <button className="bg-green-500 p-2 text-white rounded" onClick={ run }> execute </button>
    </div>
  ) : ( <p> loading </p> )
}

export default App
