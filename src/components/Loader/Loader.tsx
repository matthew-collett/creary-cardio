import styles from './styles.module.css'

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={styles.loader}></div>
    </div>
  )
}
