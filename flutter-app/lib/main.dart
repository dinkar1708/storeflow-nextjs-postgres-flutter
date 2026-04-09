import 'package:flutter/material.dart';

void main() {
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
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('StoreFlow')),
      body: const Center(
        child: Text('Welcome to StoreFlow'),
      ),
    );
  }
}
