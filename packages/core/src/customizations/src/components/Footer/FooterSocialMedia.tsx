import Facebook from '../Icons/SocialMedia/Facebook'
import Instagram from '../Icons/SocialMedia/Instagram'
import Linkedin from '../Icons/SocialMedia/Linkedin'
import X from '../Icons/SocialMedia/X'
import Youtube from '../Icons/SocialMedia/Youtube'
import styles from './FooterSocialMedia.module.scss'
import type { SocialMedia } from '../../@generated/cms/CustomFooter'

const socialIcons = {
  Facebook,
  Instagram,
  Linkedin,
  X,
  Youtube,
}

type FooterSocialMediaProps = {
  socialLinks: SocialMedia
}

const FooterSocialMedia = ({ socialLinks }: FooterSocialMediaProps) => {
  return (
    <div className={styles.social}>
      {socialLinks.map((link) => {
        const key = link.icon.icon as keyof typeof socialIcons
        const SocialIcon = socialIcons[key]

        return (
          <a
            className={styles.socialIcon}
            href={link.url}
            key={link.icon.icon}
            aria-label={link.alt}
          >
            {SocialIcon && <SocialIcon />}
          </a>
        )
      })}
    </div>
  )
}

export default FooterSocialMedia
