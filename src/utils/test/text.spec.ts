import { joinPath, parseJsonSafely } from '../text.helper';

describe('parseJsonSafely', () => {
  describe('when input is null or undefined', () => {
    it('should return empty object for null', () => {
      const result = parseJsonSafely(null);
      expect(result).toEqual({});
    });

    it('should return empty object for undefined', () => {
      const result = parseJsonSafely(undefined);
      expect(result).toEqual({});
    });

    it('should return empty object for empty string', () => {
      const result = parseJsonSafely('');
      expect(result).toEqual({});
    });

    it('should return empty object for zero', () => {
      const result = parseJsonSafely(0);
      expect(result).toEqual({});
    });

    it('should return empty object for false', () => {
      const result = parseJsonSafely(false);
      expect(result).toEqual({});
    });
  });

  describe('when input is a valid JSON string', () => {
    it('should parse valid JSON object string', () => {
      const jsonStr = '{"name":"John","age":30}';
      const result = parseJsonSafely<{ name: string; age: number }>(jsonStr);
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should parse valid JSON array string', () => {
      const jsonStr = '[1,2,3]';
      const result = parseJsonSafely<number[]>(jsonStr);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should parse valid JSON string value', () => {
      const jsonStr = '"hello"';
      const result = parseJsonSafely<string>(jsonStr);
      expect(result).toBe('hello');
    });

    it('should parse valid JSON number', () => {
      const jsonStr = '42';
      const result = parseJsonSafely<number>(jsonStr);
      expect(result).toBe(42);
    });

    it('should parse valid JSON boolean', () => {
      const jsonStr = 'true';
      const result = parseJsonSafely<boolean>(jsonStr);
      expect(result).toBe(true);
    });

    it('should parse nested JSON objects', () => {
      const jsonStr = '{"user":{"name":"Alice","address":{"city":"NYC"}}}';
      const result = parseJsonSafely(jsonStr);
      expect(result).toEqual({
        user: { name: 'Alice', address: { city: 'NYC' } },
      });
    });

    it('should parse JSON null', () => {
      const jsonStr = 'null';
      const result = parseJsonSafely(jsonStr);
      expect(result).toBeNull();
    });
  });

  describe('when input is invalid JSON string', () => {
    it('should return the string as-is when JSON parsing fails', () => {
      const invalidJson = '{invalid json}';
      const result = parseJsonSafely(invalidJson);
      expect(result).toBe(invalidJson);
    });

    it('should handle malformed JSON with unclosed bracket', () => {
      const invalidJson = '{"name":"John"';
      const result = parseJsonSafely(invalidJson);
      expect(result).toBe(invalidJson);
    });

    it('should handle single quotes (not valid JSON)', () => {
      const invalidJson = "{'name':'John'}";
      const result = parseJsonSafely(invalidJson);
      expect(result).toBe(invalidJson);
    });

    it('should handle trailing commas', () => {
      const invalidJson = '{"name":"John",}';
      const result = parseJsonSafely(invalidJson);
      expect(result).toBe(invalidJson);
    });
  });

  describe('when input is already a parsed object', () => {
    it('should return object as-is', () => {
      const obj = { name: 'John', age: 30 };
      const result = parseJsonSafely(obj);
      expect(result).toBe(obj);
    });

    it('should return array as-is', () => {
      const arr = [1, 2, 3];
      const result = parseJsonSafely(arr);
      expect(result).toBe(arr);
    });

    it('should return number as-is', () => {
      const num = 42;
      const result = parseJsonSafely(num);
      expect(result).toBe(num);
    });

    it('should return string as-is when not JSON', () => {
      const str = 'plain text';
      const result = parseJsonSafely(str);
      expect(result).toBe(str);
    });
  });

  describe('type safety', () => {
    it('should support generic type inference', () => {
      interface User {
        name: string;
        email: string;
      }
      const jsonStr = '{"name":"Bob","email":"bob@example.com"}';
      const result = parseJsonSafely<User>(jsonStr);
      expect(result.name).toBe('Bob');
      expect(result.email).toBe('bob@example.com');
    });
  });
});

describe('joinPath', () => {
  describe('basic path joining', () => {
    it('should join single segment', () => {
      const result = joinPath('users');
      expect(result).toBe('/users');
    });

    it('should join two segments', () => {
      const result = joinPath('users', 'profile');
      expect(result).toBe('/users/profile');
    });

    it('should join multiple segments', () => {
      const result = joinPath('api', 'v1', 'users', 'posts');
      expect(result).toBe('/api/v1/users/posts');
    });
  });

  describe('handling leading and trailing slashes', () => {
    it('should remove leading slash from first segment', () => {
      const result = joinPath('/users', 'profile');
      expect(result).toBe('/users/profile');
    });

    it('should remove trailing slash from segments', () => {
      const result = joinPath('users/', 'profile');
      expect(result).toBe('/users/profile');
    });

    it('should remove both leading and trailing slashes', () => {
      const result = joinPath('/users/', '/profile/');
      expect(result).toBe('/users/profile');
    });

    it('should handle segments with multiple leading slashes', () => {
      const result = joinPath('//users', 'profile');
      expect(result).toBe('/users/profile');
    });

    it('should handle segments with multiple trailing slashes', () => {
      const result = joinPath('users//', 'profile');
      expect(result).toBe('/users/profile');
    });

    it('should handle segments with both multiple leading and trailing slashes', () => {
      const result = joinPath('//users//', '//profile//');
      expect(result).toBe('/users/profile');
    });
  });

  describe('empty segments handling', () => {
    it('should filter out empty segments', () => {
      const result = joinPath('users', '', 'profile');
      expect(result).toBe('/users/profile');
    });

    it('should filter out multiple empty segments', () => {
      const result = joinPath('api', '', '', 'v1', '', 'users');
      expect(result).toBe('/api/v1/users');
    });

    it('should handle all empty segments', () => {
      const result = joinPath('', '', '');
      expect(result).toBe('/');
    });
  });

  describe('complex scenarios', () => {
    it('should combine slash removal and empty filtering', () => {
      const result = joinPath('/api/', '', '/v1/', 'users', '');
      expect(result).toBe('/api/v1/users');
    });

    it('should handle segments with special characters', () => {
      const result = joinPath('api', 'v1', 'users-list', 'active');
      expect(result).toBe('/api/v1/users-list/active');
    });

    it('should handle segments with numbers', () => {
      const result = joinPath('v1', '123', 'items', '456');
      expect(result).toBe('/v1/123/items/456');
    });

    it('should handle query string-like segments', () => {
      const result = joinPath('search', 'results');
      expect(result).toBe('/search/results');
    });

    it('should preserve slashes in the middle of segments', () => {
      const result = joinPath('api', 'v1/users');
      expect(result).toBe('/api/v1/users');
    });
  });

  describe('edge cases', () => {
    it('should handle no arguments', () => {
      const result = joinPath();
      expect(result).toBe('/');
    });

    it('should handle single empty string', () => {
      const result = joinPath('');
      expect(result).toBe('/');
    });

    it('should handle single slash', () => {
      const result = joinPath('/');
      expect(result).toBe('/');
    });

    it('should handle segments that are only slashes', () => {
      const result = joinPath('/', '/', 'users', '/', '/');
      expect(result).toBe('/users');
    });

    it('should handle multiple leading slashes in each segment', () => {
      const result = joinPath('///users', '///posts');
      expect(result).toBe('/users/posts');
    });
  });

  describe('real-world use cases', () => {
    it('should build RESTful API endpoint', () => {
      const result = joinPath('api', 'v2', 'users', '123');
      expect(result).toBe('/api/v2/users/123');
    });

    it('should build nested resource path', () => {
      const result = joinPath(
        '/teams',
        'my-team',
        'projects',
        'project-1',
        'tasks',
      );
      expect(result).toBe('/teams/my-team/projects/project-1/tasks');
    });

    it('should handle file paths', () => {
      const result = joinPath('uploads', 'users', 'avatars');
      expect(result).toBe('/uploads/users/avatars');
    });
  });
});
