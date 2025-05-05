import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '@/assets/logo.svg'
import { Button, LinkButton } from '@/components/core'
import { Alert, Card, PasswordInput, TextInput } from '@/components/core'
import { useAuth } from '@/context'

const Login = () => {
  const navigate = useNavigate()
  const [isResetMode, setIsResetMode] = useState<boolean>(false)
  const [resetSent, setResetSent] = useState<boolean>(false)
  const { user, login, resetPassword, actionLoading, error, clearError } = useAuth()
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: v => (v.trim() ? null : 'Email is required'),
      password: v => (v.trim() ? null : 'Password is required'),
    },
  })

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = form.onSubmit(async vals => {
    if (isResetMode) {
      const success = await resetPassword(vals.email)
      if (success) {
        setResetSent(true)
        setTimeout(() => setResetSent(false), 3000)
      }
      return
    }
    await login(vals.email, vals.password)
    form.reset()
  })

  const toggleResetMode = () => {
    setIsResetMode(!isResetMode)
    setResetSent(false)
    clearError()
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary py-6 px-4">
      <Card className="w-full max-w-md bg-background">
        <div className="flex flex-col justify-center items-center">
          <img className="w-28 sm:w-36" src={logo} alt="Creary Cardio Logo" />
          <h2 className="text-2xl font-bold text-primary text-center mt-3">
            {isResetMode ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="text-center text-sm sm:text-base">
            {isResetMode
              ? 'Enter your email to receive a reset link'
              : 'Login to continue to Creary Cardio'}
          </p>
        </div>
        <div className="py-4 sm:py-6 sm:px-6">
          {error && <Alert error>{error}</Alert>}
          {resetSent && <Alert>Reset link has been sent to your email!</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps('email')}
            />
            {!isResetMode && (
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Enter your password"
                {...form.getInputProps('password')}
              />
            )}
            <Button type="submit" loading={actionLoading}>
              {isResetMode ? 'Send Reset Link' : 'Login'}
            </Button>
          </form>
          <div className="text-center mt-4 text-sm">
            <LinkButton onClick={toggleResetMode}>
              {isResetMode ? 'Back to login' : 'Forgot password?'}
            </LinkButton>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login
