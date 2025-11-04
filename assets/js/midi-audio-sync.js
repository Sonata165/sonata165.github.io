/**
 * MIDI Audio Sync - Syncs MIDI visualizer with MP3 audio playback
 * 
 * Usage:
 *   syncMidiWithAudio(playerId, audioId)
 * 
 * Example:
 *   <midi-visualizer src="..." id="viz-1"></midi-visualizer>
 *   <midi-player src="..." sound-font="..." visualizer="#viz-1" id="player-1"></midi-player>
 *   <audio id="audio-1"><source src="..."></audio>
 *   <script>syncMidiWithAudio('player-1', 'audio-1');</script>
 */

// Flag to control whether to show MIDI Audio Sync Logs on the page
const SHOW_MIDI_AUDIO_SYNC_LOGS = false;

function syncMidiWithAudio(playerId, audioId) {
  console.log('[SYNC] Initializing sync for:', playerId, audioId);
  const player = document.getElementById(playerId);
  const audio = document.getElementById(audioId);
  
  if (!player || !audio) {
    console.error('[SYNC] Player or audio element not found:', playerId, audioId);
    return;
  }
  
  // Extract filename from audio source for logging
  function getAudioFilename() {
    if (audio.src) {
      const url = new URL(audio.src, window.location.href);
      const pathParts = url.pathname.split('/');
      return pathParts[pathParts.length - 1] || 'unknown';
    }
    // Try to get from source element
    const source = audio.querySelector('source');
    if (source && source.src) {
      const url = new URL(source.src, window.location.href);
      const pathParts = url.pathname.split('/');
      return pathParts[pathParts.length - 1] || 'unknown';
    }
    return 'unknown';
  }
  
  const audioFilename = getAudioFilename();
  
  console.log('[SYNC] Elements found, setting up sync for:', playerId);
  
  // Log storage
  const logStorage = [];
  const MAX_LOGS = 1000; // Keep last 1000 logs
  
  // Important events for debugging
  const debugEvents = [
    'PLAYER_START',
    'AUDIO_READY_RESOLVED',
    'AUDIO_PLAY_ABORTED_PLAYER_STOPPED',
    'AUDIO_PLAY_ABORTED_PLAYER_STOPPED_BEFORE_PLAY',
    'AUDIO_PLAY_ABORTED_PLAYER_STOPPED_DURING_PLAY',
    'AUDIO_PLAY_ERROR_PLAYER_STOPPED',
    'AUDIO_PLAY_SUCCESS',
    'AUDIO_PLAY_UNDEFINED',
    'AUDIO_PLAY_ERROR',
    'AUDIO_READY_TIMEOUT',
    'AUDIO_READY_TIMEOUT_PLAYER_STOPPED',
    'AUDIO_PAUSED_EVENT',
    'AUDIO_PAUSED_IN_GRACE_PERIOD',
    'AUDIO_ALREADY_PLAYING_DURING_BUFFER_CHECK',
    'AUDIO_RESUME_AFTER_GRACE_PERIOD_PAUSE',
    'AUDIO_ERROR_EVENT',
    'AUDIO_PIPELINE_ERROR_DETECTED',
    'AUDIO_PIPELINE_ERROR_IN_GRACE_PERIOD',
    'AUDIO_RESUMED_AFTER_PIPELINE_ERROR_GRACE_PERIOD',
    'AUDIO_RESUME_AFTER_PIPELINE_ERROR_GRACE_PERIOD_FAILED',
    'AUDIO_PIPELINE_ERROR_MAX_ATTEMPTS_REACHED',
    'AUDIO_RESUMED_AFTER_PIPELINE_ERROR',
    'AUDIO_RESUMED_AFTER_PIPELINE_ERROR_NO_SEEK',
    'AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK',
    'AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK_DELAYED',
    'AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED',
    'AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED',
    'AUDIO_ERROR_BEFORE_SEEK',
    'AUDIO_ERROR_BEFORE_RESUME_AFTER_BUFFER',
    'AUDIO_RESUME_AFTER_BUFFER_ERROR_RECOVERY',
    'AUDIO_RESUME_AFTER_BUFFER_ERROR_RECOVERY_FAILED',
    'AUDIO_RESUME_AFTER_GRACE_PERIOD_FAILED',
    'UNEXPECTED_PAUSE_DETECTED',
    'SEEKBAR_MOUSEDOWN',
    'SEEKBAR_CHANGE',
    'AUDIO_PAUSED_BY_SEEKBAR',
    'AUDIO_CURRENTTIME_SET',
    'AFTER_SEEK_CHECK',
    'AUTO_RESUMING_UNEXPECTED_PAUSE',
    'AUTO_RESUMING_DURING_SEEK',
    'AUTO_RESUME_DURING_SEEK_SUCCESS',
    'AUTO_RESUME_DURING_SEEK_FAILED',
    'AUDIO_PAUSED_DURING_SEEK_MONITOR',
    'AUTO_RESUME_DURING_SEEK_MONITOR_SUCCESS',
    'AUTO_RESUME_DURING_SEEK_MONITOR_FAILED',
    'AUTO_RESUME_SUCCESS',
    'AUTO_RESUME_FAILED',
    'BUFFER_READY',
    'AUDIO_RESUME_AFTER_BUFFER',
    'AUDIO_PAUSED_AFTER_RESUME',
    'AUDIO_RESUME_AFTER_PAUSE_SUCCESS',
    'AUDIO_RESUME_AFTER_PAUSE_FAILED',
    'AUDIO_RESUME_ERROR'
  ];
  
  // Logging function to track state
  function logState(event, details) {
    // Only log debug events
    if (!debugEvents.includes(event)) {
      return;
    }
    
    const time = new Date().toLocaleTimeString();
    const audioTime = audio.currentTime.toFixed(2);
    const playerTime = player.currentTime ? player.currentTime.toFixed(2) : 'N/A';
    const audioPaused = audio.paused;
    const playerPlaying = player.playing;
    const seeking = details.seekingInProgress !== undefined ? details.seekingInProgress : 'N/A';
    
    // Create simplified log entry
    const logEntry = {
      time: time,
      event: event,
      audioTime: audioTime,
      playerTime: playerTime,
      audioPaused: audioPaused,
      playerPlaying: playerPlaying,
      seekingInProgress: seeking,
      audioFilename: audioFilename,
      details: details
    };
    
    // Store log
    logStorage.push(logEntry);
    if (logStorage.length > MAX_LOGS) {
      logStorage.shift(); // Remove oldest log
    }
  }
  
  // Function to download logs as JSON file
  function downloadLogs() {
    const logData = {
      playerId: playerId,
      audioId: audioId,
      logs: logStorage,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `midi-audio-sync-logs-${playerId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Store logs and download function globally
  if (!window.midiAudioSyncLogs) {
    window.midiAudioSyncLogs = {};
    
    // Only create log box if SHOW_MIDI_AUDIO_SYNC_LOGS is enabled
    if (SHOW_MIDI_AUDIO_SYNC_LOGS) {
      // Create log box at bottom of page (inside content flow)
      const logBox = document.createElement('div');
    logBox.id = 'midi-audio-sync-log-box';
    logBox.style.cssText = `
      width: 100%;
      max-width: 1200px;
      margin: 40px auto 20px auto;
      padding: 20px;
      background: #f5f5f5;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-family: monospace;
      font-size: 11px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    const logHeader = document.createElement('div');
    logHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    `;
    
    const logTitle = document.createElement('h3');
    logTitle.textContent = 'MIDI Audio Sync Logs';
    logTitle.style.cssText = `
      margin: 0;
      padding: 0;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    `;
    
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy All';
    copyButton.style.cssText = `
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: normal;
    `;
    copyButton.addEventListener('mouseenter', function() {
      this.style.background = '#0056b3';
    });
    copyButton.addEventListener('mouseleave', function() {
      this.style.background = '#007bff';
    });
    copyButton.addEventListener('click', function() {
      const allLogs = [];
      for (const [pid, data] of Object.entries(window.midiAudioSyncLogs)) {
        allLogs.push(...data.logs.map(log => ({
          ...log,
          playerId: pid
        })));
      }
      
      const displayLogs = allLogs.length > 50 ? allLogs.slice(-50) : allLogs;
      const logText = displayLogs.map(log => {
        const parts = [
          `[${log.time}]`,
          log.event,
          log.audioFilename ? `file:${log.audioFilename}` : '',
          `audio:${log.audioTime}s`,
          log.audioPaused ? 'PAUSED' : 'playing',
          `player:${log.playerTime}s`,
          log.playerPlaying ? 'playing' : 'stopped',
          log.seekingInProgress !== 'N/A' ? `seeking:${log.seekingInProgress}` : ''
        ].filter(p => p).join(' | ');
        return parts;
      }).join('\n');
      
      navigator.clipboard.writeText(logText).then(function() {
        copyButton.textContent = 'Copied!';
        setTimeout(function() {
          copyButton.textContent = 'Copy All';
        }, 2000);
      }).catch(function(err) {
        console.error('Failed to copy:', err);
        copyButton.textContent = 'Failed';
        setTimeout(function() {
          copyButton.textContent = 'Copy All';
        }, 2000);
      });
    });
    
    logHeader.appendChild(logTitle);
    logHeader.appendChild(copyButton);
    
    const logContent = document.createElement('pre');
    logContent.id = 'midi-audio-sync-log-content';
    logContent.style.cssText = `
      margin: 0;
      padding: 15px;
      overflow-y: auto;
      max-height: 300px;
      background: white;
      white-space: pre-wrap;
      word-wrap: break-word;
      border: 1px solid #ddd;
      border-radius: 4px;
      user-select: text;
      -webkit-user-select: text;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.4;
    `;
    
    logBox.appendChild(logHeader);
    logBox.appendChild(logContent);
    // Append to the end of body, inside the content flow
    document.body.appendChild(logBox);
    
    // Update log display function
    window.updateMidiAudioSyncLogDisplay = function() {
      const allLogs = [];
      for (const [pid, data] of Object.entries(window.midiAudioSyncLogs)) {
        allLogs.push(...data.logs.map(log => ({
          ...log,
          playerId: pid
        })));
      }
      
      // Show last 50 logs
      const displayLogs = allLogs.length > 50 ? allLogs.slice(-50) : allLogs;
      
      // Format as one line per log
      logContent.textContent = displayLogs.map(log => {
        const parts = [
          `[${log.time}]`,
          log.event,
          log.audioFilename ? `file:${log.audioFilename}` : '',
          `audio:${log.audioTime}s`,
          log.audioPaused ? 'PAUSED' : 'playing',
          `player:${log.playerTime}s`,
          log.playerPlaying ? 'playing' : 'stopped',
          log.seekingInProgress !== 'N/A' ? `seeking:${log.seekingInProgress}` : ''
        ];
        
        // Add error details if present
        if (log.details && log.details.error) {
          parts.push(`error:${log.details.error}`);
        }
        if (log.details && log.details.message) {
          parts.push(`msg:${log.details.message}`);
        }
        
        return parts.filter(p => p).join(' | ');
      }).join('\n');
      
      // Auto-scroll to bottom
      logContent.scrollTop = logContent.scrollHeight;
    };
    
    // Update every 2 seconds
    setInterval(window.updateMidiAudioSyncLogDisplay, 2000);
    }
  }
  
  window.midiAudioSyncLogs[playerId] = {
    logs: logStorage,
    download: downloadLogs
  };
  
  // Update display when new logs are added
  const originalLogState = logState;
  logState = function(event, details) {
    originalLogState(event, details);
    if (SHOW_MIDI_AUDIO_SYNC_LOGS && window.updateMidiAudioSyncLogDisplay) {
      window.updateMidiAudioSyncLogDisplay();
    }
  };
  
  // Ensure audio is loaded
  audio.preload = 'auto';
  audio.volume = 1.0;
  audio.muted = false;
  
  // Add error listener to track loading issues
  audio.addEventListener('error', function(e) {
    const errorDetails = {
      code: audio.error ? audio.error.code : 'N/A',
      message: audio.error ? audio.error.message : 'N/A',
      networkState: audio.networkState,
      readyState: audio.readyState,
      currentTime: audio.currentTime,
      duration: audio.duration,
      src: audio.src
    };
    
    console.error('[SYNC] Audio element error for', playerId, ':', e);
    console.error('[SYNC] Error details:', errorDetails);
    
    // Log the error in our log system
    logState('AUDIO_ERROR_EVENT', errorDetails);
    
    // If it's a demuxer/pipeline error, try to reload the audio
    if (audio.error && audio.error.message && 
        (audio.error.message.includes('FFmpegDemuxer') || 
         audio.error.message.includes('PIPELINE_ERROR') ||
         audio.error.message.includes('data source error'))) {
      const now = Date.now();
      const timeSinceLastError = now - lastPipelineErrorTime;
      const timeSinceLastSuccess = now - lastSuccessfulRecoveryTime;
      
      // If enough time has passed since last successful recovery, reset the counter
      if (timeSinceLastSuccess > RECOVERY_SUCCESS_COOLDOWN && pipelineErrorRecoveryAttempts > 0) {
        console.log('[SYNC] Enough time passed since last successful recovery, resetting counter for:', playerId);
        pipelineErrorRecoveryAttempts = 0;
      }
      
      // Check cooldown and max attempts to avoid infinite loops
      if (pipelineErrorRecoveryAttempts >= MAX_PIPELINE_ERROR_RECOVERY_ATTEMPTS) {
        console.error('[SYNC] Max pipeline error recovery attempts reached, stopping recovery for:', playerId);
        logState('AUDIO_PIPELINE_ERROR_MAX_ATTEMPTS_REACHED', errorDetails);
        return;
      }
      
      if (timeSinceLastError < PIPELINE_ERROR_COOLDOWN) {
        console.log('[SYNC] Pipeline error cooldown active, skipping recovery for:', playerId);
        return;
      }
      
      console.log('[SYNC] Detected pipeline error, attempting to reload audio for:', playerId);
      logState('AUDIO_PIPELINE_ERROR_DETECTED', {
        ...errorDetails,
        recoveryAttempt: pipelineErrorRecoveryAttempts + 1
      });
      
      pipelineErrorRecoveryAttempts++;
      lastPipelineErrorTime = now;
      
      // If we're seeking, we need to be more careful about recovery
      // If there's an error, we must reload to clear it, but we need to restore position
      if (seekingInProgress) {
        console.log('[SYNC] Pipeline error during seek, attempting careful recovery for:', playerId);
        
        // If there's an error, we need to reload to clear it, then restore position
        if (audio.error && player.playing && !playerExplicitlyStopped) {
          const currentPos = audio.currentTime;
          const targetTime = player.currentTime;
          console.log('[SYNC] Audio has error during seek, reloading to clear it for:', playerId, 'position:', currentPos);
          
          // Clear any existing seek monitor to prevent interference during reload
          if (window.seekMonitorIntervals && window.seekMonitorIntervals[playerId]) {
            clearInterval(window.seekMonitorIntervals[playerId]);
            delete window.seekMonitorIntervals[playerId];
          }
          
          // Reload to clear the error, then restore position
          const restorePos = targetTime > 0 ? targetTime : currentPos;
          audio.load();
          
          // Wait for audio to be ready, then restore position and resume
          waitForAudioReady().then(function() {
            if (player.playing && seekingInProgress && !playerExplicitlyStopped && audio.readyState >= 2 && !audio.error) {
              if (restorePos > 0) {
                audio.currentTime = restorePos;
                // Wait a bit for position to be set before playing
                setTimeout(function() {
                  // Check if player stopped or seeking was cleared during wait
                  if (!player.playing || !seekingInProgress || playerExplicitlyStopped) {
                    console.log('[SYNC] Player stopped or seeking cleared during error recovery wait for:', playerId);
                    return;
                  }
                  
                  // Check for errors again before playing
                  if (audio.error) {
                    console.error('[SYNC] Audio still has error after reload during seek, trying again for:', playerId);
                    // Try reloading again
                    const newTargetTime = player.currentTime;
                    const newRestorePos = newTargetTime > 0 ? newTargetTime : restorePos;
                    audio.load();
                    waitForAudioReady().then(function() {
                      if (player.playing && seekingInProgress && !playerExplicitlyStopped && audio.readyState >= 2 && !audio.error) {
                        if (newRestorePos > 0) {
                          audio.currentTime = newRestorePos;
                        }
                        setTimeout(function() {
                          if (player.playing && seekingInProgress && !playerExplicitlyStopped && !audio.error) {
                            audio.play().then(function() {
                              logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK', { position: newRestorePos, hadError: true, reloaded: true, retry: true });
                              lastSuccessfulRecoveryTime = Date.now();
                            }).catch(function(err) {
                              logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
                            });
                          }
                        }, 100);
                      }
                    }).catch(function(err) {
                      console.error('[SYNC] Failed to wait for audio ready after retry reload during seek:', err);
                    });
                    return;
                  }
                  
                  // Verify position was restored correctly (within 1 second of target)
                  const actualPos = audio.currentTime;
                  const posDiff = Math.abs(actualPos - restorePos);
                  if (posDiff > 1.0 && actualPos < 1.0) {
                    // Position wasn't restored, try again
                    audio.currentTime = restorePos;
                    setTimeout(function() {
                      if (player.playing && seekingInProgress && !playerExplicitlyStopped && !audio.error) {
                        audio.play().then(function() {
                          logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK', { position: restorePos, hadError: true, reloaded: true });
                          lastSuccessfulRecoveryTime = Date.now();
                        }).catch(function(err) {
                          logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
                        });
                      }
                    }, 100);
                  } else {
                    // Position restored, try to play
                    if (!audio.error) {
                      audio.play().then(function() {
                        logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK', { position: restorePos, hadError: true, reloaded: true });
                        lastSuccessfulRecoveryTime = Date.now();
                      }).catch(function(err) {
                        logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
                      });
                    }
                  }
                }, 100);
              } else {
                if (!audio.error) {
                  audio.play().then(function() {
                    logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK', { position: restorePos, hadError: true, reloaded: true });
                    lastSuccessfulRecoveryTime = Date.now();
                  }).catch(function(err) {
                    logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
                  });
                }
              }
            } else if (!player.playing || !seekingInProgress || playerExplicitlyStopped) {
              // Player stopped or seeking cleared during recovery
              console.log('[SYNC] Player stopped or seeking cleared during error recovery for:', playerId);
            } else if (audio.error) {
              // Still has error after reload, try one more time
              console.error('[SYNC] Audio still has error after reload during seek, will be handled by error handler for:', playerId);
            }
          }).catch(function(err) {
            console.error('[SYNC] Failed to wait for audio ready after error during seek:', err);
            logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
          });
        } else if (player.playing && audio.paused && !playerExplicitlyStopped) {
          // No error but paused - try to resume normally
          // The seek monitor should handle this, but we can help
          setTimeout(function() {
            // If still paused after seek monitor had a chance, try to resume
            if (player.playing && audio.paused && seekingInProgress && !playerExplicitlyStopped && !audio.error) {
              const currentPos = audio.currentTime;
              
              // Check if current position is buffered
              const buffered = audio.buffered;
              let canResume = false;
              if (buffered.length > 0) {
                for (let i = 0; i < buffered.length; i++) {
                  if (currentPos >= buffered.start(i) && currentPos <= buffered.end(i)) {
                    canResume = true;
                    break;
                  }
                }
              }
              
              if (canResume || audio.readyState >= 2) {
                audio.play().then(function() {
                  logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK', { position: currentPos });
                }).catch(function(err) {
                  logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
                });
              } else {
                // Position not buffered, but try anyway after a short delay
                setTimeout(function() {
                  if (player.playing && audio.paused && seekingInProgress && !playerExplicitlyStopped && !audio.error) {
                    audio.play().then(function() {
                      logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_DURING_SEEK_DELAYED', { position: currentPos });
                    }).catch(function(err) {
                      logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_DURING_SEEK_FAILED', { error: err.name, message: err.message });
                    });
                  }
                }, 300);
              }
            }
          }, 500);
        }
        
        // Reset cooldown after seek completes
        setTimeout(function() {
          lastSuccessfulRecoveryTime = Date.now();
        }, 5000);
        return;
      }
      
      // Check if we're in the grace period - if so, skip reload to avoid position reset
      const timeSinceStart = Date.now() - audioStartTime;
      const inGracePeriod = timeSinceStart < GRACE_PERIOD_AFTER_START;
      
      if (inGracePeriod) {
        console.log('[SYNC] Pipeline error during grace period, skipping reload to avoid position reset for:', playerId);
        logState('AUDIO_PIPELINE_ERROR_IN_GRACE_PERIOD', { timeSinceStart: timeSinceStart });
        
        // Handle errors during grace period - whether audio is paused or playing
        if (player.playing && !playerExplicitlyStopped) {
          const currentPos = audio.currentTime;
          const targetTime = player.currentTime;
          
          // Check if audio has an error - if so, we might need to handle it differently
          if (audio.error) {
            console.log('[SYNC] Audio has error during grace period, currentPos:', currentPos, 'playing:', !audio.paused);
            
            // If audio is paused, try to play
            if (audio.paused) {
              // Sometimes the error clears if we just try to play
              audio.play().then(function() {
                logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_GRACE_PERIOD', { position: currentPos, hadError: true });
                // Check if error persists after a short delay - if so, reload to clear it
                setTimeout(function() {
                  if (audio.error && player.playing && !playerExplicitlyStopped) {
                    console.log('[SYNC] Error persists after grace period recovery, reloading to clear it for:', playerId);
                    const restorePos = targetTime > 0 ? targetTime : currentPos;
                    audio.load();
                    waitForAudioReady().then(function() {
                      if (player.playing && !playerExplicitlyStopped && audio.readyState >= 2) {
                        if (restorePos > 0) {
                          audio.currentTime = restorePos;
                        }
                        audio.play().then(function() {
                          logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_GRACE_PERIOD_RELOAD', { position: restorePos });
                          lastSuccessfulRecoveryTime = Date.now();
                        }).catch(function(err) {
                          logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_GRACE_PERIOD_RELOAD_FAILED', { error: err.name, message: err.message });
                        });
                      }
                    }).catch(function(err) {
                      console.error('[SYNC] Failed to wait for audio ready after grace period reload:', err);
                    });
                  } else {
                    // Error cleared, mark recovery as successful
                    lastSuccessfulRecoveryTime = Date.now();
                  }
                }, 500);
              }).catch(function(err) {
                logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_GRACE_PERIOD_FAILED', { error: err.name, message: err.message });
                // If play fails, reload after a short delay
                setTimeout(function() {
                  if (audio.error && player.playing && !playerExplicitlyStopped) {
                    console.log('[SYNC] Play failed during grace period, reloading to clear error for:', playerId);
                    const restorePos = targetTime > 0 ? targetTime : currentPos;
                    audio.load();
                    waitForAudioReady().then(function() {
                      if (player.playing && !playerExplicitlyStopped && audio.readyState >= 2) {
                        if (restorePos > 0) {
                          audio.currentTime = restorePos;
                        }
                        audio.play().then(function() {
                          logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_GRACE_PERIOD_RELOAD', { position: restorePos });
                          lastSuccessfulRecoveryTime = Date.now();
                        }).catch(function(err) {
                          logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_GRACE_PERIOD_RELOAD_FAILED', { error: err.name, message: err.message });
                        });
                      }
                    }).catch(function(err) {
                      console.error('[SYNC] Failed to wait for audio ready after grace period reload:', err);
                    });
                  }
                }, 300);
              });
            } else {
              // Audio is playing but has an error - monitor for a bit, then reload if error persists
              console.log('[SYNC] Audio playing but has error during grace period, monitoring for:', playerId);
              setTimeout(function() {
                if (audio.error && player.playing && !playerExplicitlyStopped) {
                  console.log('[SYNC] Error persists while audio playing during grace period, reloading to clear it for:', playerId);
                  const restorePos = targetTime > 0 ? targetTime : currentPos;
                  audio.load();
                  waitForAudioReady().then(function() {
                    if (player.playing && !playerExplicitlyStopped && audio.readyState >= 2) {
                      if (restorePos > 0) {
                        audio.currentTime = restorePos;
                      }
                      audio.play().then(function() {
                        logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_GRACE_PERIOD_RELOAD', { position: restorePos });
                        lastSuccessfulRecoveryTime = Date.now();
                      }).catch(function(err) {
                        logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_GRACE_PERIOD_RELOAD_FAILED', { error: err.name, message: err.message });
                      });
                    }
                  }).catch(function(err) {
                    console.error('[SYNC] Failed to wait for audio ready after grace period reload:', err);
                  });
                } else {
                  // Error cleared, mark recovery as successful
                  lastSuccessfulRecoveryTime = Date.now();
                }
              }, 500);
            }
          } else if (audio.paused) {
            // No error but paused - just try to resume
            audio.play().then(function() {
              logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_GRACE_PERIOD', { position: currentPos });
              lastSuccessfulRecoveryTime = Date.now();
            }).catch(function(err) {
              logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_GRACE_PERIOD_FAILED', { error: err.name, message: err.message });
            });
          }
        }
        return;
      }
      
      // Try to reload the audio
      const currentSrc = audio.src;
      const targetTime = player.currentTime;
      audio.load();
      
      // If player is still playing, try to resume after reload
      // But don't resume if player was explicitly stopped
      if (player.playing && !playerExplicitlyStopped) {
        // Wait longer for audio to be ready after reload
        waitForAudioReady().then(function() {
          if (audio.readyState >= 2 && player.playing && !audio.error) {
            // Only seek if we're not in the middle of a seek operation
            if (!seekingInProgress && targetTime > 0) {
              // Check if target time is buffered before seeking
              const buffered = audio.buffered;
              let canSeek = false;
              if (buffered.length > 0) {
                for (let i = 0; i < buffered.length; i++) {
                  if (targetTime >= buffered.start(i) && targetTime <= buffered.end(i)) {
                    canSeek = true;
                    break;
                  }
                }
              }
              
              // Wait for buffer to load at target time if not already buffered
              if (!canSeek && audio.readyState < 4) {
                // Wait a bit for buffer to load
                setTimeout(function() {
                  const buffered2 = audio.buffered;
                  let canSeek2 = false;
                  if (buffered2.length > 0) {
                    for (let i = 0; i < buffered2.length; i++) {
                      if (targetTime >= buffered2.start(i) && targetTime <= buffered2.end(i)) {
                        canSeek2 = true;
                        break;
                      }
                    }
                  }
                  
                  if (canSeek2 || audio.readyState >= 4) {
                    audio.currentTime = targetTime;
                    audio.play().then(function() {
                      logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR', { targetTime: targetTime });
                      lastSuccessfulRecoveryTime = Date.now();
                    }).catch(function(err) {
                      logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED', { error: err.name, message: err.message });
                    });
                  } else {
                    // Can't seek to target, just play from beginning
                    audio.play().then(function() {
                      logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_NO_SEEK', { reason: 'target_not_buffered' });
                      lastSuccessfulRecoveryTime = Date.now();
                    }).catch(function(err) {
                      logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED', { error: err.name, message: err.message });
                    });
                  }
                }, 500);
              } else if (canSeek || audio.readyState >= 4) {
                audio.currentTime = targetTime;
                audio.play().then(function() {
                  logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR', { targetTime: targetTime });
                  // Mark successful recovery time
                  lastSuccessfulRecoveryTime = Date.now();
                }).catch(function(err) {
                  logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED', { error: err.name, message: err.message });
                });
              } else {
                // Can't seek, just play from current position
                audio.play().then(function() {
                  logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR_NO_SEEK', {});
                  lastSuccessfulRecoveryTime = Date.now();
                }).catch(function(err) {
                  logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED', { error: err.name, message: err.message });
                });
              }
            } else {
              // Just play without seeking
              audio.play().then(function() {
                logState('AUDIO_RESUMED_AFTER_PIPELINE_ERROR', {});
                lastSuccessfulRecoveryTime = Date.now();
              }).catch(function(err) {
                logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED', { error: err.name, message: err.message });
              });
            }
          }
        }).catch(function(e) {
          console.error('[SYNC] Failed to wait for audio ready after pipeline error:', e);
          logState('AUDIO_RESUME_AFTER_PIPELINE_ERROR_FAILED', { error: e.name, message: e.message });
        });
      } else {
        // Reset attempts if player stopped
        pipelineErrorRecoveryAttempts = 0;
        lastSuccessfulRecoveryTime = 0;
      }
    }
  });
  
  // Listen for when audio starts loading
  audio.addEventListener('loadstart', function() {
    console.log('[SYNC] Audio loadstart for:', playerId);
  });
  
  audio.addEventListener('loadedmetadata', function() {
    console.log('[SYNC] Audio loadedmetadata for:', playerId, 'duration:', audio.duration);
  });
  
  audio.load();
  
  // Wait for audio to be ready enough to start playing
  function waitForAudioReady() {
    return new Promise(function(resolve, reject) {
      console.log('[SYNC] waitForAudioReady called for:', playerId, 'readyState:', audio.readyState, 'networkState:', audio.networkState);
      
      // Check if we have enough data to start playing (HAVE_CURRENT_DATA = 2)
      // This is less strict than HAVE_ENOUGH_DATA (4) but allows playback to start
      if (audio.readyState >= 2) {
        console.log('[SYNC] Audio already ready, resolving immediately for:', playerId);
        resolve();
        return;
      }
      
      function onCanPlay() {
        console.log('[SYNC] canplay event fired for:', playerId, 'readyState:', audio.readyState);
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        resolve();
      }
      
      function onError(e) {
        console.error('[SYNC] Audio error event for:', playerId, e);
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        reject(e);
      }
      
      function onLoadedData() {
        console.log('[SYNC] loadeddata event fired for:', playerId, 'readyState:', audio.readyState);
        // If we get loadeddata, we have at least HAVE_CURRENT_DATA
        if (audio.readyState >= 2) {
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          audio.removeEventListener('loadeddata', onLoadedData);
          resolve();
        }
      }
      
      // Use 'canplay' instead of 'canplaythrough' - fires when enough data to start
      audio.addEventListener('canplay', onCanPlay, { once: true });
      audio.addEventListener('error', onError, { once: true });
      audio.addEventListener('loadeddata', onLoadedData, { once: true });
      
      // Timeout after 3 seconds - if we have some data, try anyway
      setTimeout(function() {
        console.log('[SYNC] waitForAudioReady timeout for:', playerId, 'readyState:', audio.readyState, 'networkState:', audio.networkState);
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadeddata', onLoadedData);
        // If we have at least HAVE_CURRENT_DATA, resolve anyway
        if (audio.readyState >= 2) {
          console.log('[SYNC] Resolving timeout - readyState >= 2 for:', playerId);
          resolve();
        } else if (audio.readyState >= 1 || audio.networkState >= 2) {
          // Even if readyState is low, if networkState shows we're loading, try anyway
          console.log('[SYNC] Resolving timeout - networkState >= 2, will try to play for:', playerId);
          resolve();
        } else {
          console.error('[SYNC] Rejecting timeout - readyState < 2 and networkState < 2 for:', playerId);
          reject(new Error('Timeout waiting for audio to be ready'));
        }
      }, 3000);
    });
  }
  
  // Track if this is the first start (not a resume)
  let isFirstStart = true;
  
  // Track if we're in the middle of a seek operation (accessible from all handlers)
  let seekingInProgress = false;
  
  // Track when audio was last started - ignore pauses for a short grace period after start
  let audioStartTime = 0;
  const GRACE_PERIOD_AFTER_START = 2000; // 2 seconds grace period after start
  
  // Track pipeline error recovery attempts to avoid infinite loops
  let pipelineErrorRecoveryAttempts = 0;
  const MAX_PIPELINE_ERROR_RECOVERY_ATTEMPTS = 3;
  let lastPipelineErrorTime = 0;
  const PIPELINE_ERROR_COOLDOWN = 3000; // 3 seconds cooldown between recovery attempts
  let lastSuccessfulRecoveryTime = 0;
  const RECOVERY_SUCCESS_COOLDOWN = 5000; // 5 seconds before resetting counter after successful recovery
  
  // Track if player has been explicitly stopped by user - prevent auto-resume
  let playerExplicitlyStopped = false;
  
  // Start both visualizer and audio together - no syncing during playback
  player.addEventListener('start', function () {
    console.log('[SYNC] Player start event fired for:', playerId);
    logState('PLAYER_START', {
      audioReadyState: audio.readyState,
      audioNetworkState: audio.networkState,
      audioPaused: audio.paused,
      audioDuration: audio.duration,
      audioSrc: audio.src
    });
    
    // Check audio element state before waiting
    console.log('[SYNC] Audio state before waitForAudioReady:', {
      readyState: audio.readyState,
      networkState: audio.networkState,
      paused: audio.paused,
      duration: audio.duration,
      src: audio.src,
      error: audio.error
    });
    
    // If audio has an error, reload it first
    if (audio.error) {
      console.log('[SYNC] Audio has error on player start, reloading for:', playerId);
      audio.load();
      // Wait a bit for reload to start
      setTimeout(function() {
        if (!player.playing) {
          return; // Player stopped during reload wait
        }
        // Continue with normal flow
        waitForAudioReady().then(function() {
          continueStartPlayback();
        }).catch(function(e) {
          console.error('[SYNC] Failed to wait for audio ready after reload on start:', e);
        });
      }, 100);
      return;
    }
    
    // Helper function to continue start playback
    function continueStartPlayback() {
      console.log('[SYNC] Audio ready, starting playback for:', playerId);
      
      // Check if player is still playing before attempting to play audio
      if (!player.playing) {
        console.log('[SYNC] Player already stopped, aborting audio play for:', playerId);
        logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED', {});
        return;
      }
      
      logState('AUDIO_READY_RESOLVED', {
        readyState: audio.readyState,
        networkState: audio.networkState,
        playerPlaying: player.playing
      });
      
      // If this is not the first start (resume), sync to player's current position
      // Otherwise, start from beginning
      if (isFirstStart) {
        audio.currentTime = 0;
        isFirstStart = false;
      } else {
        // Resume - sync audio to player's current position
        const playerCurrentTime = player.currentTime;
        if (playerCurrentTime !== undefined && playerCurrentTime !== null) {
          audio.currentTime = playerCurrentTime;
          console.log('[SYNC] Resuming playback at:', playerCurrentTime, 'for:', playerId);
        }
      }
      
      audio.volume = 1.0;
      audio.muted = false;
      
      // Double-check player is still playing right before calling play()
      if (!player.playing) {
        console.log('[SYNC] Player stopped before audio.play(), aborting for:', playerId);
        logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED_BEFORE_PLAY', {});
        return;
      }
      
      console.log('[SYNC] About to call audio.play() for:', playerId);
      // Final check right before calling play() to avoid race conditions
      if (!player.playing) {
        console.log('[SYNC] Player stopped right before audio.play(), aborting for:', playerId);
        logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED_BEFORE_PLAY', {});
        return;
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          // Check again in case player stopped during play() call
          if (!player.playing) {
            console.log('[SYNC] Player stopped during audio.play(), pausing audio for:', playerId);
            audio.pause();
            logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED_DURING_PLAY', {});
            return;
          }
          console.log('[SYNC] Audio play promise resolved for:', playerId);
          logState('AUDIO_PLAY_SUCCESS', {});
          // Mark when audio started - ignore pauses for grace period
          audioStartTime = Date.now();
        }).catch(function(e) {
          console.error('[SYNC] Audio play error for', playerId, ':', e);
          // Check if player stopped during the play attempt
          if (!player.playing) {
            logState('AUDIO_PLAY_ERROR_PLAYER_STOPPED', { error: e.name, message: e.message });
          } else {
            logState('AUDIO_PLAY_ERROR', { error: e.name, message: e.message });
          }
          console.error('Audio play error:', e);
        });
      } else {
        console.log('[SYNC] Audio play() returned undefined for:', playerId);
        logState('AUDIO_PLAY_UNDEFINED', {});
      }
    }
    
    // Wait for audio to be ready before playing
    waitForAudioReady().then(function() {
      continueStartPlayback();
    }).catch(function(e) {
      console.error('[SYNC] Failed to wait for audio ready for', playerId, ':', e);
      console.log('[SYNC] Audio state when timeout:', {
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        duration: audio.duration,
        error: audio.error,
        playerPlaying: player.playing
      });
      
      // Check if player stopped during the wait
      if (!player.playing) {
        console.log('[SYNC] Player stopped during waitForAudioReady timeout, aborting for:', playerId);
        logState('AUDIO_READY_TIMEOUT_PLAYER_STOPPED', { 
          error: e.message,
          readyState: audio.readyState,
          networkState: audio.networkState
        });
        return;
      }
      
      logState('AUDIO_READY_TIMEOUT', { 
        error: e.message,
        readyState: audio.readyState,
        networkState: audio.networkState
      });
      console.error('Failed to wait for audio ready:', e);
      
      // Double-check player is still playing before attempting to play
      if (!player.playing) {
        console.log('[SYNC] Player stopped before audio.play() in timeout handler, aborting for:', playerId);
        logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED_BEFORE_PLAY', {});
        return;
      }
      
      // Try to play anyway - even if readyState is low, browser might be able to start
      // If this is not the first start (resume), sync to player's current position
      if (isFirstStart) {
        audio.currentTime = 0;
        isFirstStart = false;
      } else {
        // Resume - sync audio to player's current position
        const playerCurrentTime = player.currentTime;
        if (playerCurrentTime !== undefined && playerCurrentTime !== null) {
          audio.currentTime = playerCurrentTime;
          console.log('[SYNC] Resuming playback at (timeout case):', playerCurrentTime, 'for:', playerId);
        }
      }
      audio.volume = 1.0;
      audio.muted = false;
      
      // Final check right before calling play()
      if (!player.playing) {
        console.log('[SYNC] Player stopped right before audio.play() in timeout handler, aborting for:', playerId);
        logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED_BEFORE_PLAY', {});
        return;
      }
      
      console.log('[SYNC] Attempting to play audio despite timeout for:', playerId);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          // Check again in case player stopped during play() call
          if (!player.playing) {
            console.log('[SYNC] Player stopped during audio.play() in timeout handler, pausing audio for:', playerId);
            audio.pause();
            logState('AUDIO_PLAY_ABORTED_PLAYER_STOPPED_DURING_PLAY', {});
            return;
          }
          console.log('[SYNC] Play succeeded despite timeout for:', playerId);
          logState('AUDIO_PLAY_SUCCESS', {});
          // Mark when audio started - ignore pauses for grace period
          audioStartTime = Date.now();
        }).catch(function(err) {
          console.error('[SYNC] Play attempt failed for', playerId, ':', err);
          // Check if player stopped during the play attempt
          if (!player.playing) {
            logState('AUDIO_PLAY_ERROR_PLAYER_STOPPED', { error: err.name, message: err.message });
          } else {
            logState('AUDIO_PLAY_ATTEMPT_FAILED', { error: err.name, message: err.message });
          }
          console.error('Play attempt failed:', err);
        });
      } else {
        console.log('[SYNC] play() returned undefined for:', playerId);
        logState('AUDIO_PLAY_UNDEFINED', {});
      }
    });
  });
  
  console.log('[SYNC] Start event listener added for:', playerId);
  
  player.addEventListener('stop', function () {
    // Mark that player was explicitly stopped by user
    playerExplicitlyStopped = true;
    
    // Reset pipeline error recovery attempts
    pipelineErrorRecoveryAttempts = 0;
    lastSuccessfulRecoveryTime = 0;
    logState('PLAYER_STOP', {});
    
    // Clear seekingInProgress when player stops
    seekingInProgress = false;
    
    // Stop any active seek monitor intervals
    if (window.seekMonitorIntervals && window.seekMonitorIntervals[playerId]) {
      clearInterval(window.seekMonitorIntervals[playerId]);
      delete window.seekMonitorIntervals[playerId];
    }
    
    // Pause audio - use a small delay to ensure any pending operations complete
    setTimeout(function() {
      if (audio && !audio.paused) {
        audio.pause();
        logState('AUDIO_PAUSED_BY_STOP', {});
      }
    }, 10);
    
    // Also pause immediately
    if (!audio.paused) {
      audio.pause();
      logState('AUDIO_PAUSED_BY_STOP', {});
    }
  });
  
  // Set up seek bar sync
  player.addEventListener('load', function() {
    setTimeout(function() {
      try {
        const SeekBar = player.shadowRoot.querySelector('.seek-bar');
        if (SeekBar) {
          let wasPlaying = false;
          
          let userInteracting = false;
          let lastChangeTime = Date.now(); // Initialize properly
          
          // Track when user starts interacting with seek bar
          SeekBar.addEventListener('mousedown', function() {
            userInteracting = true;
            seekingInProgress = true; // Set immediately on mousedown
            wasPlaying = !audio.paused;
            logState('SEEKBAR_MOUSEDOWN', { wasPlaying: wasPlaying, audioPaused: audio.paused, seekingInProgress: seekingInProgress });
            if (wasPlaying) {
              audio.pause();
              logState('AUDIO_PAUSED_BY_SEEKBAR', {});
            }
          });
          
          // Track when user releases mouse
          SeekBar.addEventListener('mouseup', function() {
            // Mark that user interaction is ending
            // Give a small window for the change event to fire
            setTimeout(function() {
              userInteracting = false;
            }, 100);
          });
          
          // Sync audio position when user releases (on change event)
          SeekBar.addEventListener('change', function() {
            const now = Date.now();
            const timeSinceLastChange = now - lastChangeTime;
            lastChangeTime = now;
            
            logState('SEEKBAR_CHANGE', { 
              wasPlaying: wasPlaying,
              userInteracting: userInteracting,
              timeSinceLastChange: timeSinceLastChange,
              playerCurrentTime: player.currentTime,
              audioCurrentTime: audio.currentTime,
              audioPaused: audio.paused
            });
            
            // Only sync if user was actually interacting (mousedown happened)
            // Also ignore rapid successive change events (likely automatic updates)
            if (wasPlaying && userInteracting && timeSinceLastChange > 50) {
              // Mark that we're seeking
              seekingInProgress = true;
              
              // Sync audio position to match the seeked position
              const targetTime = player.currentTime;
              
              // Check if we can seek to this position (buffered check)
              const buffered = audio.buffered;
              let canSeek = false;
              if (buffered.length > 0) {
                // Check if target time is within buffered range
                for (let i = 0; i < buffered.length; i++) {
                  if (targetTime >= buffered.start(i) && targetTime <= buffered.end(i)) {
                    canSeek = true;
                    break;
                  }
                }
              }
              
              logState('AUDIO_CURRENTTIME_SET', { 
                targetTime: targetTime,
                canSeek: canSeek,
                bufferedRanges: buffered.length > 0 ? 
                  Array.from({length: buffered.length}, (_, i) => ({
                    start: buffered.start(i),
                    end: buffered.end(i)
                  })) : []
              });
              
              // Check for audio errors before seeking
              if (audio.error) {
                console.error('[SYNC] Audio has error before seek, code:', audio.error.code, 'message:', audio.error.message);
                logState('AUDIO_ERROR_BEFORE_SEEK', {
                  errorCode: audio.error.code,
                  errorMessage: audio.error.message,
                  targetTime: targetTime
                });
                // Try to reload audio if there's an error
                audio.load();
                // Wait a bit for reload, then try to seek
                setTimeout(function() {
                  if (!audio.error && audio.readyState >= 2) {
                    audio.currentTime = targetTime;
                  }
                }, 200);
              } else {
                // Set currentTime - this might cause pause if position not buffered
                audio.currentTime = targetTime;
              }
              
              // Wait a bit longer to ensure seek completed and check if audio paused
              // Use a shorter delay to avoid conflicts with seek monitor
              setTimeout(function() {
                // Check if we're still seeking (might have been cleared if player stopped)
                if (!seekingInProgress) {
                  return; // Abort if seeking was cleared
                }
                
                const audioPausedAfterSeek = audio.paused;
                logState('AFTER_SEEK_CHECK', {
                  audioPaused: audioPausedAfterSeek,
                  audioCurrentTime: audio.currentTime,
                  playerCurrentTime: player.currentTime,
                  readyState: audio.readyState,
                  seekingInProgress: seekingInProgress
                });
                
                // If audio paused after seek (likely due to unbuffered position), wait for buffer
                // But only if we're still seeking and player is still playing
                // Also check if audio is already playing (seek monitor might have resumed it)
                if (audioPausedAfterSeek && seekingInProgress && player.playing && audio.paused) {
                  // Clear any existing seek monitor for this player before starting a new one
                  if (window.seekMonitorIntervals && window.seekMonitorIntervals[playerId]) {
                    clearInterval(window.seekMonitorIntervals[playerId]);
                    delete window.seekMonitorIntervals[playerId];
                  }
                  
                  // Wait for buffer to load
                  const checkBuffer = setInterval(function() {
                    // Check if we're still seeking and player is still playing
                    if (!seekingInProgress || !player.playing) {
                      clearInterval(checkBuffer);
                      return;
                    }
                    
                    // Check if audio is already playing (seek monitor might have resumed it)
                    if (!audio.paused) {
                      clearInterval(checkBuffer);
                      logState('AUDIO_ALREADY_PLAYING_DURING_BUFFER_CHECK', {});
                      // Set up seek monitor since audio is already playing
                      if (!window.seekMonitorIntervals) {
                        window.seekMonitorIntervals = {};
                      }
                      const seekMonitorInterval = setInterval(function() {
                        if (!seekingInProgress || !player.playing || playerExplicitlyStopped) {
                          clearInterval(seekMonitorInterval);
                          if (window.seekMonitorIntervals[playerId]) {
                            delete window.seekMonitorIntervals[playerId];
                          }
                          return;
                        }
                        if (audio.paused && player.playing && !playerExplicitlyStopped) {
                          // Check for errors first - if audio has an error, don't try to resume
                          // Let the error handler deal with it
                          if (audio.error) {
                            console.log('[SYNC] Audio has error during seek monitor, skipping resume for:', playerId);
                            return;
                          }
                          // Check if audio position is near 0 while player position is much higher
                          // This indicates a recent reload and we should wait for position restoration
                          const audioPos = audio.currentTime;
                          const playerPos = player.currentTime || 0;
                          if (audioPos < 1.0 && playerPos > 5.0 && Math.abs(audioPos - playerPos) > 5.0) {
                            console.log('[SYNC] Audio position near 0 during seek monitor, likely recent reload, skipping resume for:', playerId);
                            return;
                          }
                          logState('AUDIO_PAUSED_DURING_SEEK_MONITOR', {});
                          audio.play().then(function() {
                            logState('AUTO_RESUME_DURING_SEEK_MONITOR_SUCCESS', {});
                          }).catch(function(e) {
                            logState('AUTO_RESUME_DURING_SEEK_MONITOR_FAILED', { error: e.name, message: e.message });
                          });
                        }
                      }, 300);
                      window.seekMonitorIntervals[playerId] = seekMonitorInterval;
                      return;
                    }
                    
                    const buffered = audio.buffered;
                    let canPlay = false;
                    if (buffered.length > 0) {
                      for (let i = 0; i < buffered.length; i++) {
                        if (targetTime >= buffered.start(i) && targetTime <= buffered.end(i)) {
                          canPlay = true;
                          break;
                        }
                      }
                    }
                    
                    if (canPlay || audio.readyState >= 3) {
                      clearInterval(checkBuffer);
                      logState('BUFFER_READY', {
                        hasError: !!audio.error,
                        errorCode: audio.error ? audio.error.code : 'N/A',
                        errorMessage: audio.error ? audio.error.message : 'N/A',
                        readyState: audio.readyState
                      });
                      
                      // Check for audio errors before trying to play
                      if (audio.error) {
                        console.error('[SYNC] Audio has error before resuming after buffer, code:', audio.error.code, 'message:', audio.error.message);
                        logState('AUDIO_ERROR_BEFORE_RESUME_AFTER_BUFFER', {
                          errorCode: audio.error.code,
                          errorMessage: audio.error.message,
                          targetTime: targetTime
                        });
                        // Try to reload audio if there's an error
                        audio.load();
                        // Wait for audio to be ready, then try to play
                        waitForAudioReady().then(function() {
                          if (!audio.error && audio.readyState >= 2 && seekingInProgress && player.playing && !playerExplicitlyStopped) {
                            audio.currentTime = targetTime;
                            setTimeout(function() {
                              if (seekingInProgress && player.playing && !playerExplicitlyStopped && !audio.error) {
                                audio.play().then(function() {
                                  logState('AUDIO_RESUME_AFTER_BUFFER_ERROR_RECOVERY', {});
                                }).catch(function(e) {
                                  logState('AUDIO_RESUME_AFTER_BUFFER_ERROR_RECOVERY_FAILED', { error: e.name, message: e.message });
                                  // If play fails and error persists, try reloading again
                                  if (audio.error && seekingInProgress && player.playing && !playerExplicitlyStopped) {
                                    setTimeout(function() {
                                      if (seekingInProgress && player.playing && !playerExplicitlyStopped) {
                                        const newTargetTime = player.currentTime;
                                        audio.load();
                                        waitForAudioReady().then(function() {
                                          if (!audio.error && audio.readyState >= 2 && seekingInProgress && player.playing && !playerExplicitlyStopped) {
                                            audio.currentTime = newTargetTime;
                                            setTimeout(function() {
                                              if (seekingInProgress && player.playing && !playerExplicitlyStopped && !audio.error) {
                                                audio.play().then(function() {
                                                  logState('AUDIO_RESUME_AFTER_BUFFER_ERROR_RECOVERY', { retry: true });
                                                }).catch(function(e) {
                                                  logState('AUDIO_RESUME_AFTER_BUFFER_ERROR_RECOVERY_FAILED', { error: e.name, message: e.message });
                                                });
                                              }
                                            }, 100);
                                          }
                                        }).catch(function(err) {
                                          console.error('[SYNC] Failed to wait for audio ready after buffer error retry:', err);
                                        });
                                      }
                                    }, 500);
                                  }
                                });
                              }
                            }, 100);
                          }
                        }).catch(function(err) {
                          console.error('[SYNC] Failed to wait for audio ready after buffer error:', err);
                        });
                        return;
                      }
                      
                      audio.play().then(function() {
                        logState('AUDIO_RESUME_AFTER_BUFFER', {});
                        
                        // Set up a persistent monitor during seeking to keep audio playing
                        // Store the interval ID in a way that can be accessed by the stop handler
                        if (!window.seekMonitorIntervals) {
                          window.seekMonitorIntervals = {};
                        }
                        const seekMonitorInterval = setInterval(function() {
                          if (!seekingInProgress || !player.playing || playerExplicitlyStopped) {
                            clearInterval(seekMonitorInterval);
                            if (window.seekMonitorIntervals[playerId]) {
                              delete window.seekMonitorIntervals[playerId];
                            }
                            return;
                          }
                          if (audio.paused && player.playing && !playerExplicitlyStopped) {
                            // Check for errors first - if audio has an error, don't try to resume
                            // Let the error handler deal with it
                            if (audio.error) {
                              console.log('[SYNC] Audio has error during seek monitor, skipping resume for:', playerId);
                              return;
                            }
                            // Check if audio position is near 0 while player position is much higher
                            // This indicates a recent reload and we should wait for position restoration
                            const audioPos = audio.currentTime;
                            const playerPos = player.currentTime || 0;
                            if (audioPos < 1.0 && playerPos > 5.0 && Math.abs(audioPos - playerPos) > 5.0) {
                              console.log('[SYNC] Audio position near 0 during seek monitor, likely recent reload, skipping resume for:', playerId);
                              return;
                            }
                            logState('AUDIO_PAUSED_DURING_SEEK_MONITOR', {});
                            audio.play().then(function() {
                              logState('AUTO_RESUME_DURING_SEEK_MONITOR_SUCCESS', {});
                            }).catch(function(e) {
                              logState('AUTO_RESUME_DURING_SEEK_MONITOR_FAILED', { error: e.name, message: e.message });
                            });
                          }
                        }, 300);
                        window.seekMonitorIntervals[playerId] = seekMonitorInterval;
                        
                        // Stop monitoring when seekingInProgress is cleared
                        const originalSeekingClear = function() {
                          clearInterval(seekMonitorInterval);
                          if (window.seekMonitorIntervals && window.seekMonitorIntervals[playerId]) {
                            delete window.seekMonitorIntervals[playerId];
                          }
                        };
                        
                        // Keep seekingInProgress true for much longer to prevent false positives
                        // Wait 3 seconds after resume to ensure playback is stable
                        setTimeout(function() {
                          // Only clear if audio is still playing
                          if (audio.paused) {
                            seekingInProgress = false;
                            originalSeekingClear();
                          } else {
                            // Audio is playing, wait another 2 seconds to be safe
                            setTimeout(function() {
                              seekingInProgress = false;
                              originalSeekingClear();
                            }, 2000);
                          }
                        }, 3000);
                      }).catch(function(e) {
                        logState('AUDIO_RESUME_AFTER_BUFFER_ERROR', { error: e.name, message: e.message });
                        seekingInProgress = false;
                      });
                    }
                  }, 100);
                  
                  // Timeout after 2 seconds
                  setTimeout(function() {
                    clearInterval(checkBuffer);
                    logState('BUFFER_TIMEOUT', {});
                    audio.play().then(function() {
                      logState('AUDIO_RESUME_TIMEOUT_SUCCESS', {});
                      // Keep seekingInProgress true for much longer to prevent false positives
                      setTimeout(function() {
                        if (audio.paused) {
                          seekingInProgress = false;
                        } else {
                          setTimeout(function() {
                            seekingInProgress = false;
                          }, 2000);
                        }
                      }, 3000);
                    }).catch(function(e) {
                      logState('AUDIO_RESUME_TIMEOUT_ERROR', { error: e.name, message: e.message });
                      seekingInProgress = false;
                    });
                  }, 2000);
                } else {
                  // Audio didn't pause, just resume normally
                  logState('RESUMING_AUDIO', { 
                    audioPaused: audio.paused,
                    audioCurrentTime: audio.currentTime,
                    playerCurrentTime: player.currentTime
                  });
                  const playPromise = audio.play();
                  if (playPromise !== undefined) {
                    playPromise.then(function() {
                      logState('AUDIO_RESUME_SUCCESS', {});
                      // Keep seekingInProgress true for much longer to prevent false positives
                      setTimeout(function() {
                        if (audio.paused) {
                          seekingInProgress = false;
                        } else {
                          // Wait longer to ensure playback is stable
                          setTimeout(function() {
                            seekingInProgress = false;
                          }, 2000);
                        }
                      }, 3000);
                    }).catch(function(e) {
                      logState('AUDIO_RESUME_ERROR', { 
                        error: e.name, 
                        message: e.message,
                        audioPaused: audio.paused
                      });
                      if (e.name !== 'AbortError') {
                        console.error('Resume error:', e);
                        seekingInProgress = false;
                      } else {
                        setTimeout(function() {
                          audio.play().then(function() {
                            logState('AUDIO_RESUME_RETRY_SUCCESS', {});
                            setTimeout(function() {
                              if (audio.paused) {
                                seekingInProgress = false;
                              } else {
                                setTimeout(function() {
                                  seekingInProgress = false;
                                }, 2000);
                              }
                            }, 3000);
                          }).catch(function(err) {
                            logState('AUDIO_RESUME_RETRY_FAILED', { error: err.name, message: err.message });
                            seekingInProgress = false;
                          });
                        }, 50);
                      }
                    });
                  } else {
                    seekingInProgress = false;
                  }
                }
              }, 50);
              
              // Reset flag after handling
              wasPlaying = false;
            } else {
              logState('SEEKBAR_CHANGE_IGNORED', {
                reason: !wasPlaying ? 'wasPlaying=false' : 
                        !userInteracting ? 'userInteracting=false' : 
                        'rapidChange'
              });
            }
          });
          
          // seekingInProgress is declared in outer scope, accessible from all handlers
          
          // Monitor audio state changes
          audio.addEventListener('pause', function() {
            // Get stack trace to see what called pause
            const stack = new Error().stack;
            const timeSinceStart = Date.now() - audioStartTime;
            const inGracePeriod = timeSinceStart < GRACE_PERIOD_AFTER_START;
            
            logState('AUDIO_PAUSED_EVENT', { 
              playerPlaying: player.playing,
              audioCurrentTime: audio.currentTime,
              seekingInProgress: seekingInProgress,
              inGracePeriod: inGracePeriod,
              timeSinceStart: timeSinceStart,
              stackTrace: stack ? stack.split('\n').slice(1, 5).join('\n') : 'N/A'
            });
            
            // If player is still playing but audio paused, this is unexpected
            // But don't auto-resume if player was explicitly stopped by user
            if (playerExplicitlyStopped) {
              // Player was explicitly stopped, don't auto-resume
              return;
            }
            
            // If we're seeking, wait a bit longer before auto-resuming (seeking handler might resume it)
            // If we're not seeking, auto-resume immediately
            // But ignore pauses that happen very soon after start (browser autoplay restrictions)
            if (player.playing && audio.paused) {
              // If we're in the grace period after start, ignore the pause and resume immediately
              // This handles browser autoplay restrictions that pause audio right after it starts
              if (inGracePeriod && !seekingInProgress) {
                console.log('[SYNC] Ignoring pause in grace period, resuming immediately for:', playerId);
                logState('AUDIO_PAUSED_IN_GRACE_PERIOD', { timeSinceStart: timeSinceStart });
                // Resume immediately without waiting
                audio.play().then(function() {
                  logState('AUDIO_RESUME_AFTER_GRACE_PERIOD_PAUSE', {});
                }).catch(function(e) {
                  logState('AUDIO_RESUME_AFTER_GRACE_PERIOD_FAILED', { error: e.name, message: e.message });
                });
                return; // Don't process this pause further
              }
              if (seekingInProgress) {
                // We're seeking - wait a bit longer for seeking handler to resume
                // But if it doesn't resume after a delay, we'll resume it
                // Also set up a monitor to keep trying if it pauses again
                setTimeout(function() {
                  if (player.playing && audio.paused && seekingInProgress && !playerExplicitlyStopped) {
                    // Check for errors first - if audio has an error, don't try to resume
                    // Let the error handler deal with it
                    if (audio.error) {
                      console.log('[SYNC] Audio has error during seek pause handler, skipping resume for:', playerId);
                      return;
                    }
                    
                    // Seeking handler didn't resume it, try to resume now
                    logState('AUTO_RESUMING_DURING_SEEK', {});
                    const buffered = audio.buffered;
                    const currentTime = audio.currentTime;
                    let canResume = false;
                    
                    if (buffered.length > 0) {
                      for (let i = 0; i < buffered.length; i++) {
                        if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
                          canResume = true;
                          break;
                        }
                      }
                    }
                    
                    if (canResume || audio.readyState >= 3) {
                      audio.play().then(function() {
                        logState('AUTO_RESUME_DURING_SEEK_SUCCESS', {});
                        // Set up a monitor to keep checking if audio pauses again during seek
                        const seekMonitor = setInterval(function() {
                          if (!seekingInProgress || !player.playing || playerExplicitlyStopped) {
                            clearInterval(seekMonitor);
                            return;
                          }
                          if (audio.paused && player.playing && !playerExplicitlyStopped) {
                            // Check for errors first - if audio has an error, don't try to resume
                            // Let the error handler deal with it
                            if (audio.error) {
                              console.log('[SYNC] Audio has error during seek monitor, skipping resume for:', playerId);
                              return;
                            }
                            // Check if audio position is near 0 while player position is much higher
                            // This indicates a recent reload and we should wait for position restoration
                            const audioPos = audio.currentTime;
                            const playerPos = player.currentTime || 0;
                            if (audioPos < 1.0 && playerPos > 5.0 && Math.abs(audioPos - playerPos) > 5.0) {
                              console.log('[SYNC] Audio position near 0 during seek monitor, likely recent reload, skipping resume for:', playerId);
                              return;
                            }
                            logState('AUDIO_PAUSED_DURING_SEEK_MONITOR', {});
                            audio.play().then(function() {
                              logState('AUTO_RESUME_DURING_SEEK_MONITOR_SUCCESS', {});
                            }).catch(function(e) {
                              logState('AUTO_RESUME_DURING_SEEK_MONITOR_FAILED', { error: e.name, message: e.message });
                            });
                          }
                        }, 500);
                        // Stop monitoring after seekingInProgress is cleared (should be within 5 seconds)
                        setTimeout(function() {
                          clearInterval(seekMonitor);
                        }, 6000);
                      }).catch(function(e) {
                        logState('AUTO_RESUME_DURING_SEEK_FAILED', { error: e.name, message: e.message });
                      });
                    }
                  }
                }, 500);
              } else {
                // Not seeking - normal unexpected pause
                // But check if audio has an error first - if so, let error handler deal with it
                if (audio.error) {
                  console.log('[SYNC] Audio has error, skipping unexpected pause auto-resume for:', playerId);
                  // Error handler will deal with it
                  return;
                }
                
                logState('UNEXPECTED_PAUSE_DETECTED', {});
                // Wait a bit for buffer to catch up, then resume
                setTimeout(function() {
                  // Double-check that we're still not seeking and player is still playing
                  // Also check that player wasn't explicitly stopped and audio doesn't have an error
                  if (player.playing && audio.paused && !seekingInProgress && !playerExplicitlyStopped && !audio.error) {
                    const buffered = audio.buffered;
                    const currentTime = audio.currentTime;
                    let canResume = false;
                    
                    if (buffered.length > 0) {
                      for (let i = 0; i < buffered.length; i++) {
                        if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
                          canResume = true;
                          break;
                        }
                      }
                    }
                    
                    if (canResume || audio.readyState >= 3) {
                      logState('AUTO_RESUMING_UNEXPECTED_PAUSE', {});
                      audio.play().then(function() {
                        logState('AUTO_RESUME_SUCCESS', {});
                      }).catch(function(e) {
                        logState('AUTO_RESUME_FAILED', { error: e.name, message: e.message });
                      });
                    }
                  }
                }, 200);
              }
            }
          });
          
          audio.addEventListener('play', function() {
            logState('AUDIO_PLAY_EVENT', { 
              playerPlaying: player.playing,
              audioCurrentTime: audio.currentTime
            });
          });
          
          audio.addEventListener('ended', function() {
            logState('AUDIO_ENDED', {});
          });
          
          audio.addEventListener('stalled', function() {
            logState('AUDIO_STALLED', {});
          });
          
          audio.addEventListener('waiting', function() {
            logState('AUDIO_WAITING', {});
          });
          
          // Monitor player state changes
          player.addEventListener('start', function() {
            logState('PLAYER_START_EVENT', {});
          });
          
          player.addEventListener('stop', function() {
            logState('PLAYER_STOP_EVENT', { audioPaused: audio.paused });
          });
        }
      } catch(e) {
        console.error('SeekBar setup error:', e);
      }
    }, 500);
  });
}

// Auto-initialize on DOM ready if syncMidiWithAudio is not called manually
document.addEventListener("DOMContentLoaded", function() {
  // Check for data-sync attributes
  const players = document.querySelectorAll('midi-player[data-sync-audio]');
  players.forEach(function(player) {
    const audioId = player.getAttribute('data-sync-audio');
    if (audioId && player.id) {
      syncMidiWithAudio(player.id, audioId);
    }
  });
});

