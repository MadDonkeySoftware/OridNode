import { map } from 'lodash';
import * as v1 from './v1';

describe(__filename, () => {
  describe('generate', () => {
    describe('Returns properly formatted orid', () => {
      it('when requesting colon separated orid; including custom, omitting useSlashSeparator', () => {
        // Arrange
        const input = {
          provider: 'test-provider',
          custom1: 'custom-1',
          custom2: 'custom-2',
          custom3: 'custom-3',
          service: 'test-service',
          resourceId: 'resource-id',
          resourceRider: 'resource-rider',
        };

        // Act
        const orid = v1.generate(input);

        // Assert
        expect(orid).toBe('orid:1:test-provider:custom-1:custom-2:custom-3:test-service:resource-id:resource-rider');
      });

      it('when requesting colon separated orid; including custom, useSlashSeparator false', () => {
        // Arrange
        const input = {
          provider: 'test-provider',
          custom1: 'custom-1',
          custom2: 'custom-2',
          custom3: 'custom-3',
          service: 'test-service',
          resourceId: 'resource-id',
          resourceRider: 'resource-rider',
          useSlashSeparator: false,
        };

        // Act
        const orid = v1.generate(input);

        // Assert
        expect(orid).toBe('orid:1:test-provider:custom-1:custom-2:custom-3:test-service:resource-id:resource-rider');
      });

      it('when requesting slash separated orid; including custom, useSlashSeparator true', () => {
        // Arrange
        const input = {
          provider: 'test-provider',
          custom1: 'custom-1',
          custom2: 'custom-2',
          custom3: 'custom-3',
          service: 'test-service',
          resourceId: 'resource-id',
          resourceRider: 'resource-rider',
          useSlashSeparator: true,
        };

        // Act
        const orid = v1.generate(input);

        // Assert
        expect(orid).toBe('orid:1:test-provider:custom-1:custom-2:custom-3:test-service:resource-id/resource-rider');
      });

      it('when requesting orid; not including custom, omitting useSlashSeparator, no resource type', () => {
        // Arrange
        const input = {
          provider: 'test-provider',
          service: 'test-service',
          resourceId: 'resource-id',
        };

        // Act
        const orid = v1.generate(input);

        // Assert
        expect(orid).toBe('orid:1:test-provider::::test-service:resource-id');
      });
    });
  });

  describe('isValid', () => {
    it('returns true on valid short orid', () => {
      map([
        'orid:1:a::::svc:id',
        'orid:1:a:1:::svc:id',
        'orid:1:a:1:2::svc:id',
        'orid:1:a:1:2:3:svc:id',
      ],
      (orid: string) => expect(v1.isValid(orid)).toBe(true));
    });

    it('returns true on valid long orid', () => {
      map([
        'orid:1:a::::svc:id/rider',
        'orid:1:a::::svc:id:rider',
        'orid:1:a:1:::svc:id/rider',
        'orid:1:a:1:::svc:id:rider',
        'orid:1:a:1:2::svc:id/rider',
        'orid:1:a:1:2::svc:id:rider',
        'orid:1:a:1:2:3:svc:id/rider',
        'orid:1:a:1:2:3:svc:id:rider',
      ],
      (orid: string) => expect(v1.isValid(orid)).toBe(true));
    });
  });

  describe('parse', () => {
    describe('returns proper object', () => {
      it('when parsing colon separated orid; including custom fields and resource type', () => {
        // Arrange
        const expected = {
          provider: 'test-provider',
          custom1: 'custom-1',
          custom2: 'custom-2',
          custom3: 'custom-3',
          service: 'test-service',
          resourceId: 'resource-id',
          resourceRider: 'resource-rider',
        };

        // Act
        const output = v1.parse('orid:1:test-provider:custom-1:custom-2:custom-3:test-service:resource-id:resource-rider');

        // Assert
        expect(output).toEqual(expected);
      });

      it('when parsing slash separated orid; including custom fields', () => {
        // Arrange
        const expected = {
          provider: 'test-provider',
          custom1: 'custom-1',
          custom2: 'custom-2',
          custom3: 'custom-3',
          service: 'test-service',
          resourceId: 'resource-id',
          resourceRider: 'resource-rider',
        };

        // Act
        const output = v1.parse('orid:1:test-provider:custom-1:custom-2:custom-3:test-service:resource-id/resource-rider');

        // Assert
        expect(output).toEqual(expected);
      });

      it('when requesting orid; not including custom, omitting useSlashSeparator, no resource type', () => {
        // Arrange
        const expected = {
          provider: 'test-provider',
          custom1: '',
          custom2: '',
          custom3: '',
          service: 'test-service',
          resourceId: 'resource-id',
          resourceRider: undefined as string,
        };

        // Act
        const output = v1.parse('orid:1:test-provider::::test-service:resource-id');

        // Assert
        expect(output).toEqual(expected);
      });
    });

    describe('throws error', () => {
      it('when non-string is provided', () => {
        expect(v1.parse.bind(null, 1)).toThrow('orid must be of type string');
      });

      it('when non-orid string is provided', () => {
        expect(v1.parse.bind(null, 'abc')).toThrow('Provided string does not appear to be a orid');
      });

      it('when malformed orid string is provided', () => {
        expect(v1.parse.bind(null, 'orid:1:abc')).toThrow('ORID appears to be invalid format');
      });
    });
  });
});
