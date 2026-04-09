import 'package:flutter/material.dart';
import 'package:storeflow/core/session_store.dart';

/// Route arguments for [DashboardPage] (used with [Navigator.pushNamed]).
class DashboardRouteArgs {
  const DashboardRouteArgs({
    required this.displayName,
    required this.role,
  });

  final String displayName;
  final String role;
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({
    super.key,
    required this.displayName,
    required this.role,
  });

  final String displayName;
  final String role;

  Future<void> _logout(BuildContext context) async {
    await SessionStore.clear();
    if (!context.mounted) return;
    Navigator.of(context).pushNamedAndRemoveUntil('/login', (_) => false);
  }

  String get _appBarTitle {
    switch (role) {
      case 'ADMIN':
        return 'Admin dashboard';
      case 'STAFF':
        return 'Staff dashboard';
      default:
        return 'Dashboard';
    }
  }

  String get _subtitle {
    switch (role) {
      case 'ADMIN':
        return 'Your admin workspace will go here.';
      case 'STAFF':
        return 'Your staff workspace will go here.';
      default:
        return 'Your workspace will go here.';
    }
  }

  IconData get _leadingIcon {
    switch (role) {
      case 'ADMIN':
        return Icons.admin_panel_settings_outlined;
      case 'STAFF':
        return Icons.support_agent_outlined;
      default:
        return Icons.person_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_appBarTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
            onPressed: () => _logout(context),
          ),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _leadingIcon,
                  size: 64,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(height: 24),
                Text(
                  'Welcome, $displayName',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (role.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    role,
                    textAlign: TextAlign.center,
                    style: theme.textTheme.labelLarge?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
                const SizedBox(height: 12),
                Text(
                  _subtitle,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
