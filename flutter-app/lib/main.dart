import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:logging/logging.dart';
import 'package:storeflow/features/dashboard/dashboard_page.dart';
import 'package:storeflow/features/login/login_page.dart';

void main() {
  if (kDebugMode) {
    Logger.root.level = Level.ALL;
    Logger.root.onRecord.listen((record) {
      debugPrint(record.message);
    });
  }
  runApp(const StoreFlowApp());
}

class StoreFlowApp extends StatelessWidget {
  const StoreFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StoreFlow',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (_) => const LoginPage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/dashboard') {
          final args = settings.arguments;
          final a = args is DashboardRouteArgs
              ? args
              : const DashboardRouteArgs(
                  displayName: 'User',
                  role: '',
                );
          return MaterialPageRoute<void>(
            builder: (_) => DashboardPage(
              displayName: a.displayName,
              role: a.role,
            ),
            settings: settings,
          );
        }
        return null;
      },
    );
  }
}
