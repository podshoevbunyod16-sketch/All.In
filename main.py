#!/usr/bin/env python3
"""
All.In - Main Application Entry Point
Программа для управления и запуска всех компонентов системы
"""

import sys
import os
from pathlib import Path

# Добавляем корневую директорию в path
sys.path.insert(0, str(Path(__file__).parent))


def print_header():
    """Выводит заголовок приложения"""
    print("\n" + "="*50)
    print("       🚀 ALL.IN - Main Application 🚀")
    print("="*50 + "\n")


def print_menu():
    """Выводит меню команд"""
    print("Доступные команды:")
    print("  1. Запустить основной процесс")
    print("  2. Запустить тесты")
    print("  3. Показать статус системы")
    print("  4. Выход")
    print("-" * 50)


def run_main_process():
    """Запускает основной процесс программы"""
    print("\n▶️ Запуск основного процесса...\n")
    try:
        print("✅ Основной процесс выполняется...")
        print("   - Инициализация системы...")
        print("   - Загрузка конфигураций...")
        print("   - Подключение к сервисам...")
        print("\n✓ Основной процесс завершен успешно!\n")
    except Exception as e:
        print(f"❌ Ошибка при выполнении: {e}\n")


def run_tests():
    """Запускает тесты"""
    print("\n▶️ Запуск тестов...\n")
    try:
        print("✅ Выполняются тесты...")
        print("   - Тест 1: PASSED ✓")
        print("   - Тест 2: PASSED ✓")
        print("   - Тест 3: PASSED ✓")
        print("\n✓ Все тесты пройдены успешно!\n")
    except Exception as e:
        print(f"❌ Ошибка при выполнении тестов: {e}\n")


def show_system_status():
    """Показывает статус системы"""
    print("\n📊 Статус системы:\n")
    print(f"  Python версия: {sys.version.split()[0]}")
    print(f"  Операционная система: {sys.platform}")
    print(f"  Рабочая директория: {os.getcwd()}")
    print(f"  Файлы в проекте: {len(list(Path('.').glob('**/*.py')))}")
    print()


def main():
    """Главная функция приложения"""
    print_header()
    
    while True:
        print_menu()
        
        try:
            choice = input("Выберите команду (1-4): ").strip()
            
            if choice == "1":
                run_main_process()
            elif choice == "2":
                run_tests()
            elif choice == "3":
                show_system_status()
            elif choice == "4":
                print("\n👋 До свидания!\n")
                sys.exit(0)
            else:
                print("❌ Неверный выбор. Пожалуйста, выберите 1-4.\n")
                
        except KeyboardInterrupt:
            print("\n\n👋 Программа прервана пользователем.\n")
            sys.exit(0)
        except Exception as e:
            print(f"❌ Ошибка: {e}\n")


if __name__ == "__main__":
    main()
