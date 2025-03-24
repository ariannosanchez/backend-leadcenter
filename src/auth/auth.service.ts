import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { nanoid } from 'nanoid';
import { encrypt } from 'src/utils/encrypt';
import { ConfigService } from '@nestjs/config';
import { TenantConnectionService } from 'src/services/tenant-connection.service';
import { SecretSchema } from './entities/secret.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { decrypt } from 'src/utils/decrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private configService: ConfigService,
    private tenantConnectionService: TenantConnectionService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) { }


  async login(loginUserdto: LoginUserDto) {
    //Find if user exists by email
    const { email, password } = loginUserdto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //Fetch tenant specific secret key
    const secretKey = await this.fetchAccessTokenSecretSigningKey(user.tenantId);
    //Generate JWT access token
    const accessToken = await this.jwtService.sign(
      { userId: user.id },
      { secret: secretKey, expiresIn: '10h' },
    );

    return { accessToken, tenantId: user.tenantId };
  }

  async createSecretKeyForNewTenant(tenantId: string) {
    //Generate Random Secret Key
    const jwtSecret = nanoid(128);

    //Encrypt the Secret Key
    const encryptedSecret = encrypt(
      jwtSecret,
      this.configService.get(`security.encryptionSecretKey`),
    );
    //Get access to the tenant specific model
    const secrestModel = await this.tenantConnectionService.getTenantModel({
      name: 'Secret',
      schema: SecretSchema
    }, tenantId);
    //Store the encrypted secret key
    await secrestModel.create({ jwtSecret: encryptedSecret });
  }

  async fetchAccessTokenSecretSigningKey(tenantId: string) {
    const secretModel = await this.tenantConnectionService.getTenantModel(
      {
        name: 'Secret',
        schema: SecretSchema
      },
      tenantId,
    );

    const secretsDoc = await secretModel.findOne();
    const secretKey = decrypt(
      secretsDoc.jwtSecret,
      this.configService.get(`security.encryptionSecretKey`),
    );
    return secretKey;
  }

}
