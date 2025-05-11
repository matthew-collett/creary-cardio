const AuthAction = () => <div></div>
// const [searchParams] = useSearchParams()
// const navigate = useNavigate()
// // States
// const [email, setEmail] = useState<string>('')
// const [newPassword, setNewPassword] = useState<string>('')
// const [confirmPassword, setConfirmPassword] = useState<string>('')
// const [error, setError] = useState<string>('')
// const [loading, setLoading] = useState<boolean>(true)
// const [success, setSuccess] = useState<boolean>(false)
// // Get action parameters from URL
// const mode = searchParams.get('mode')
// const oobCode = searchParams.get('oobCode')
// useEffect(() => {
//   if (!oobCode) {
//     setError('No action code provided. Please check your email link and try again.')
//     setLoading(false)
//     return
//   }
//   // Currently only handling password reset
//   // Future: add handling for verifyEmail and other modes
//   if (mode === 'resetPassword') {
//     verifyPasswordResetCode(auth, oobCode)
//       .then(email => {
//         setEmail(email)
//         setLoading(false)
//       })
//       .catch(err => {
//         console.error('Error verifying reset code:', err)
//         setError('This password reset link is invalid or has expired. Please request a new one.')
//         setLoading(false)
//       })
//   } else {
//     // For now, just show an error for unsupported actions
//     setError(`Action type "${mode}" is not supported yet.`)
//     setLoading(false)
//   }
// }, [mode, oobCode])
// const handleResetPassword = async (e: React.FormEvent) => {
//   e.preventDefault()
//   // Password validation
//   if (newPassword !== confirmPassword) {
//     setError('Passwords do not match.')
//     return
//   }
//   if (newPassword.length < 8) {
//     setError('Password must be at least 8 characters long.')
//     return
//   }
//   setLoading(true)
//   setError('')
//   try {
//     await confirmPasswordReset(auth, oobCode as string, newPassword)
//     setSuccess(true)
//   } catch (err: any) {
//     console.error('Error confirming password reset:', err)
//     setError(err.message || 'Failed to reset password. Please try again.')
//   } finally {
//     setLoading(false)
//   }
// }
// // Loading state
// if (loading) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Processing your request...</p>
//       </div>
//     </div>
//   )
// }
// // Error state
// if (error) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <div className="bg-red-50 p-4 rounded-md mb-4">
//           <p className="text-red-600">{error}</p>
//         </div>
//         <button
//           onClick={() => navigate('/forgot-password')}
//           className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Request a new reset link
//         </button>
//       </div>
//     </div>
//   )
// }
// // Success state
// if (success) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
//         <svg
//           className="h-12 w-12 text-green-500 mx-auto"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//         </svg>
//         <h2 className="text-xl font-semibold mt-4 text-gray-800">Password Reset Complete</h2>
//         <p className="mt-2 text-gray-600">Your password has been successfully updated.</p>
//         <button
//           onClick={() => navigate('/login')}
//           className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Go to Login
//         </button>
//       </div>
//     </div>
//   )
// }
// // Password reset form
// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100">
//     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//       <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h1>
//       {email && (
//         <div className="mb-4">
//           <p className="text-gray-600">Enter a new password for:</p>
//           <p className="font-medium text-gray-800">{email}</p>
//         </div>
//       )}
//       <form onSubmit={handleResetPassword} className="space-y-4">
//         <div>
//           <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
//             New Password
//           </label>
//           <input
//             id="new-password"
//             type="password"
//             value={newPassword}
//             onChange={e => setNewPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Password must be at least 8 characters long
//           </p>
//         </div>
//         <div>
//           <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
//             Confirm Password
//           </label>
//           <input
//             id="confirm-password"
//             type="password"
//             value={confirmPassword}
//             onChange={e => setConfirmPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   </div>
// )
// }

export default AuthAction
