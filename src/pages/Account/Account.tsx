import { Badge, FileButton } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconUser } from '@tabler/icons-react'
import { Navigate } from 'react-router-dom'

import { ProfilePhoto, PageTitle } from '@/components'
import { Button, Card, TextInput, Alert, ColorInput, PasswordInput, Modal } from '@/components/core'
import { showError, showSuccess } from '@/components/notifications'
import { useAuth } from '@/context'

const Account = () => {
  const {
    user,
    updateUser,
    changePassword,
    uploadProfilePicture,
    deleteProfilePicture,
    actionLoading,
    logout,
  } = useAuth()
  const [opened, { open, close }] = useDisclosure(false)

  const profileForm = useForm({
    initialValues: {
      displayName: user?.displayName || '',
      color: user?.color || '',
    },
    validate: {
      displayName: v => (v ? null : 'Display name is required'),
      color: v => (v ? null : 'Colour is required'),
    },
  })

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: v => (v ? null : 'Current password is required'),
      newPassword: v => (v ? null : 'New password is required'),
      confirmPassword: (v, values) =>
        !v
          ? 'Confirm password is required'
          : v !== values.newPassword
            ? 'Passwords do not match'
            : null,
    },
  })

  const handleProfileSubmit = profileForm.onSubmit(async ({ displayName, color }) => {
    const { success, error } = await updateUser({ displayName, color })
    if (!success) {
      profileForm.setErrors({ form: error })
      return
    }
    showSuccess('Profile updated successfully!')
  })

  const handlePasswordSubmit = passwordForm.onSubmit(async ({ currentPassword, newPassword }) => {
    const { success, error } = await changePassword(currentPassword, newPassword)
    if (!success) {
      passwordForm.setErrors({ form: error })
      return
    }
    showSuccess('Password updated successfully!')
    passwordForm.reset()
  })

  const handleUploadPhoto = async (file: File | null) => {
    if (!file) {
      return
    }

    const { success, error } = await uploadProfilePicture(file)
    if (success) {
      showSuccess('Profile photo updated successfully!')
    } else {
      showError(error)
    }
    close()
  }

  const handleDeletePhoto = async () => {
    const { success, error } = await deleteProfilePicture()
    if (success) {
      showSuccess('Profile photo deleted successfully!')
    } else {
      showError(error)
    }
    close()
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <PageTitle icon={IconUser} title="Your Account" />
      <div className="space-y-6 pb-6">
        <Card className="flex flex-col items-center bg-white space-y-4">
          <div className="flex flex-col space-y-1 items-center">
            <ProfilePhoto className="cursor-pointer" size="2xl" applyHover onClick={open} />
            <h3 className="text-2xl font-semibold">{user.displayName || 'User'}</h3>
            <p className="text-gray-600">{user.email}</p>
            {user.isAdmin && <Badge className="!mt-2">Admin</Badge>}
          </div>

          <Button color="accent" variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </Card>

        <Card className="bg-white space-y-4">
          <h3 className="text-xl font-bold">Profile Information</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <TextInput
              label="Display Name"
              placeholder="Your name"
              withAsterisk
              {...profileForm.getInputProps('displayName')}
            />
            <ColorInput
              label="Colour"
              placeholder="Choose a colour for your calendar"
              withAsterisk
              defaultValue={user.color}
              {...profileForm.getInputProps('color')}
            />
            {profileForm.errors.form && <Alert error>{profileForm.errors.form}</Alert>}
            <Button type="submit" loading={actionLoading}>
              Update Profile
            </Button>
          </form>
        </Card>

        <Card className="bg-white space-y-4">
          <h3 className="text-xl font-bold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              withAsterisk
              {...passwordForm.getInputProps('currentPassword')}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              withAsterisk
              {...passwordForm.getInputProps('newPassword')}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              withAsterisk
              {...passwordForm.getInputProps('confirmPassword')}
            />
            {passwordForm.errors.form && <Alert error>{passwordForm.errors.form}</Alert>}
            <Button type="submit" loading={actionLoading}>
              Change Password
            </Button>
          </form>
        </Card>
      </div>

      <Modal.Root opened={opened} onClose={close}>
        <Modal.Header title="Change Profile Photo" />
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <FileButton onChange={handleUploadPhoto} accept="image/png,image/jpeg">
              {props => (
                <Button loading={actionLoading} {...props}>
                  Upload
                </Button>
              )}
            </FileButton>
            {user.photoURL && (
              <Button
                onClick={handleDeletePhoto}
                loading={actionLoading}
                className="!bg-red-700 hover:!bg-red-800 !transition-colors !duration-100"
              >
                Remove Current Photo
              </Button>
            )}
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal.Root>
    </>
  )
}

export default Account
