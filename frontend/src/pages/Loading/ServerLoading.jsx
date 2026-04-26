import { Slice } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ServerLoading = () => {
  const [status, setStatus] = useState("connecting")
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL?.replace("/api/v1", "")

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API}/health`)

        if (res.ok) {
          const data = await res.json()

          if (data.status === "healthy") {
            setStatus("connected")

            const token = localStorage.getItem("token")

            setTimeout(() => {
              if (token) navigate("/dashboard")
              else navigate("/login")
            }, 1000)
          }
        } else {
          throw new Error("Server not ready")
        }
      } catch (err) {
        setStatus("retrying")

        setTimeout(checkServer, 2000)
      }
    }

    checkServer()
  }, [navigate])

 return (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
    
    <h1 className="text-4xl font-bold mb-6 tracking-wide">
      <img src="/notebook.png" alt="Notebook" className="w-16 h-16 mx-auto mb-4" />
      Notebook
    </h1>

    <div className="relative mb-6">
      <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>

    <div className="text-center space-y-2">
      <h2 className="text-xl font-semibold text-gray-200">
        Connecting to Server
      </h2>

      {status === "connecting" && (
        <p className="text-gray-400 animate-pulse">
          Initializing backend...
        </p>
      )}

      {status === "retrying" && (
        <p className="text-yellow-400 animate-pulse">
          Retrying connection...
        </p>
      )}

      {status === "connected" && (
        <p className="text-green-400">
          Connected successfully!
        </p>
      )}
       <p className="text-gray-500 text-sm">
        If this takes too long, please check your internet connection or try refreshing the page.
      </p>
    </div>

    <p className="absolute bottom-6 text-sm text-gray-500">
      Please wait while we set things up...
    </p>
  </div>
)
}

export default ServerLoading