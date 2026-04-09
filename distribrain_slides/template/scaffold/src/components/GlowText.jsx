import * as T from '../tokens'

const glowStyles = {
  primary: { color: T.PRIMARY, textShadow: `0 0 20px ${T.PRIMARY}99, 0 0 60px ${T.PRIMARY}44` },
  secondary: { color: T.SECONDARY, textShadow: `0 0 20px ${T.SECONDARY}99, 0 0 60px ${T.SECONDARY}44` },
  tertiary: { color: T.TERTIARY, textShadow: `0 0 20px ${T.TERTIARY}99, 0 0 60px ${T.TERTIARY}44` },
  green: { color: T.GREEN, textShadow: `0 0 20px ${T.GREEN}99, 0 0 60px ${T.GREEN}44` },
}

export default function GlowText({ children, color = 'primary', style = {}, as: Tag = 'span' }) {
  return (
    <Tag style={{ ...glowStyles[color], ...style }}>
      {children}
    </Tag>
  )
}
