import { Controller, Post, Req, Res } from '@nestjs/common';
import { KJUR } from 'jsrsasign';
import { ZoomService } from './zoom.service';
import {
  inNumberArray,
  isBetween,
  isLengthLessThan,
  isRequired,
  matchesStringArray,
  validateRequest,
} from '../utils/validation';
import { toStringArray } from 'src/utils';

const validator = {
  role: [isRequired, inNumberArray([0, 1])],
  sessionName: [isRequired, isLengthLessThan(200)],
  expirationSeconds: isBetween(1800, 172800),
  userIdentity: isLengthLessThan(35),
  sessionKey: isLengthLessThan(36),
  geoRegions: matchesStringArray([
    'AU',
    'BR',
    'CA',
    'CN',
    'DE',
    'HK',
    'IN',
    'JP',
    'MX',
    'NL',
    'SG',
    'US',
  ]),
  cloudRecordingOption: inNumberArray([0, 1]),
  cloudRecordingElection: inNumberArray([0, 1]),
  audioCompatibleMode: inNumberArray([0, 1]),
};

@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @Post('session')
  createSession(@Res() res, @Req() req): any {
    const coercedBody = this.coerceRequestBody(req.body);
    const validation = validateRequest(coercedBody, validator);

    if (validation.length > 0) {
      return res.status(400).json({ errors: validation });
    }
    const {
      role,
      sessionName,
      expirationSeconds,
      userIdentity,
      sessionKey,
      geoRegions,
      cloudRecordingOption,
      cloudRecordingElection,
      audioCompatibleMode,
    } = req.body;

    const iat = Math.floor(Date.now() / 1000);
    const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
      app_key: process.env.ZOOM_VIDEO_SDK_KEY,
      role_type: role,
      tpc: sessionName,
      version: 1,
      iat,
      exp,
      user_identity: userIdentity,
      session_key: sessionKey,
      geo_regions: this.joinGeoRegions(geoRegions),
      cloud_recording_option: cloudRecordingOption,
      cloud_recording_election: cloudRecordingElection,
      audio_compatible_mode: audioCompatibleMode,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign(
      'HS256',
      sHeader,
      sPayload,
      process.env.ZOOM_VIDEO_SDK_SECRET,
    );
    return res.json({ signature: sdkJWT });
  }

  coerceRequestBody = (body) => ({
    ...body,
    ...[
      'role',
      'expirationSeconds',
      'cloudRecordingOption',
      'cloudRecordingElection',
      'audioCompatibleMode',
    ].reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: typeof body[cur] === 'string' ? parseInt(body[cur]) : body[cur],
      }),
      {},
    ),
  });

  joinGeoRegions = (geoRegions) => toStringArray(geoRegions)?.join(',');
}
