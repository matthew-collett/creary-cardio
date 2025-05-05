import '@/components/Loader/index.css'

export const Loader = () => (
  <div className="running">
    <div className="outer">
      <div className="body">
        <div className="arm behind"></div>
        <div className="arm front"></div>
        <div className="leg behind"></div>
        <div className="leg front"></div>
      </div>
    </div>
  </div>
)

export const LoadingScreen = () => (
  <div className="h-screen w-screen fixed bg-background backdrop-blur-sm flex items-center justify-center z-50">
    <Loader />
  </div>
)
