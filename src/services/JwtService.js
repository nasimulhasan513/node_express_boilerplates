import Jwt from 'jsonwebtoken'
import RefreshToken from '../models/RefreshToken'
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../../config'

class JwtService {
  static sign (payload, expiry = '1y', secret = JWT_SECRET) {
    return Jwt.sign(payload, secret, {
      expiresIn: expiry
    })
  }

  static verify (token, secret = JWT_SECRET) {
    const tokenData = Jwt.verify(token, secret)
    return tokenData
  }

  static async generateToken (user) {
    let access_token
    let refresh_token

    try {
      // token
      access_token = this.sign({ _id: user._id, role: user.role })
      refresh_token = this.sign(
        { _id: user._id, role: user.role },
        '1y',
        JWT_REFRESH_SECRET
      )

      // database whitelist
      await RefreshToken.create({ token: refresh_token })
      return { access_token, refresh_token }
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default JwtService
