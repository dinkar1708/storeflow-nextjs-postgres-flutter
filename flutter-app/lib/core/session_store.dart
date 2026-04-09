import 'package:shared_preferences/shared_preferences.dart';

class SessionStore {
  static const tokenKey = 'auth_token';
  static const userNameKey = 'auth_user_name';
  static const userRoleKey = 'auth_user_role';

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
    await prefs.remove(userNameKey);
    await prefs.remove(userRoleKey);
  }
}
