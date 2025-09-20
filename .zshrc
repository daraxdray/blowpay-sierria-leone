export JAVA_HOME=$(/usr/libexec/java_home -v 17.0.12)
export PATH=$JAVA_HOME/bin:$PATH

# Append Gradle and Android SDK paths
export PATH=$PATH:/Users/mac/Documents/code/gradle-7.6.1/bin

export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH="/usr/local/bin:$PATH"


# Make sure to add system paths at the end
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:$PATH"

eval "$(/opt/homebrew/bin/brew shellenv)"
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
