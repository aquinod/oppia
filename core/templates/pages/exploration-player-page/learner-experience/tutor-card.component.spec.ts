// Copyright 2021 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for the Tutor Card Component.
 */

import { SimpleChanges } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { AppConstants } from 'app.constants';
import { Interaction } from 'domain/exploration/InteractionObjectFactory';
import { StateCard } from 'domain/state_card/state-card.model';
import { UrlInterpolationService } from 'domain/utilities/url-interpolation.service';
import { AudioBarStatusService } from 'services/audio-bar-status.service';
import { AudioPlayerService } from 'services/audio-player.service';
import { AutogeneratedAudioPlayerService } from 'services/autogenerated-audio-player.service';
import { ContextService } from 'services/context.service';
import { DeviceInfoService } from 'services/contextual/device-info.service';
import { UrlService } from 'services/contextual/url.service';
import { WindowDimensionsService } from 'services/contextual/window-dimensions.service';
import { WindowRef } from 'services/contextual/window-ref.service';
import { UserService } from 'services/user.service';
import { MockTranslatePipe } from 'tests/unit-test-utils';
import { ExplorationPlayerConstants } from '../exploration-player-page.constants';
import { AudioPreloaderService } from '../services/audio-preloader.service';
import { AudioTranslationManagerService } from '../services/audio-translation-manager.service';
import { CurrentInteractionService } from '../services/current-interaction.service';
import { ExplorationPlayerStateService } from '../services/exploration-player-state.service';
import { LearnerAnswerInfoService } from '../services/learner-answer-info.service';
import { PlayerPositionService } from '../services/player-position.service';
import { TutorCardComponent } from './tutor-card.component';
import { I18nLanguageCodeService } from 'services/i18n-language-code.service';

class MockWindowRef {
  nativeWindow = {
    location: {
      hash: '',
      pathname: '/path/name'
    }
  };
}

describe('Tutor card component', () => {
  let fixture: ComponentFixture<TutorCardComponent>;
  let componentInstance: TutorCardComponent;

  let audioBarStatusService: AudioBarStatusService;
  let audioPlayerService: AudioPlayerService;
  let audioPreloaderService: AudioPreloaderService;
  let audioTranslationManagerService: AudioTranslationManagerService;
  let autogeneratedAudioPlayerService: AutogeneratedAudioPlayerService;
  let contextService: ContextService;
  let currentInteractionService: CurrentInteractionService;
  let deviceInfoService: DeviceInfoService;
  let explorationPlayerStateService: ExplorationPlayerStateService;
  let i18nLanguageCodeService: I18nLanguageCodeService;
  let playerPositionService: PlayerPositionService;
  let urlInterpolationService: UrlInterpolationService;
  let urlService: UrlService;
  let userService: UserService;
  let windowDimensionsService: WindowDimensionsService;

  let mockDisplayedCard = new StateCard(
    '', '', '', new Interaction([], [], null, null, [], null, null)
    , [], null, null, '', null);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        TutorCardComponent,
        MockTranslatePipe
      ],
      providers: [
        AudioBarStatusService,
        AudioPlayerService,
        AudioPreloaderService,
        AudioTranslationManagerService,
        AutogeneratedAudioPlayerService,
        ContextService,
        CurrentInteractionService,
        DeviceInfoService,
        ExplorationPlayerStateService,
        LearnerAnswerInfoService,
        PlayerPositionService,
        UrlInterpolationService,
        UrlService,
        UserService,
        WindowDimensionsService,
        {
          provide: WindowRef,
          useClass: MockWindowRef
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCardComponent);
    componentInstance = fixture.componentInstance;
    audioBarStatusService = TestBed.inject(AudioBarStatusService);
    audioPlayerService = TestBed.inject(AudioPlayerService);
    audioPreloaderService = TestBed.inject(AudioPreloaderService);
    audioTranslationManagerService = TestBed.inject(
      AudioTranslationManagerService);
    autogeneratedAudioPlayerService = TestBed.inject(
      AutogeneratedAudioPlayerService);
    contextService = TestBed.inject(ContextService);
    currentInteractionService = TestBed.inject(CurrentInteractionService);
    deviceInfoService = TestBed.inject(DeviceInfoService);
    explorationPlayerStateService = TestBed.inject(
      ExplorationPlayerStateService);
    playerPositionService = TestBed.inject(PlayerPositionService);
    urlInterpolationService = TestBed.inject(UrlInterpolationService);
    urlService = TestBed.inject(UrlService);
    userService = TestBed.inject(UserService);
    windowDimensionsService = TestBed.inject(WindowDimensionsService);
    i18nLanguageCodeService = TestBed.inject(I18nLanguageCodeService);

    spyOn(i18nLanguageCodeService, 'isCurrentLanguageRTL').and.returnValue(
      true);
  });

  afterEach(() => {
    componentInstance.ngOnDestroy();
  });

  it('should initialize', fakeAsync(() => {
    let mockOnActiveCardChangedEventEmitter = new EventEmitter<void>();
    let mockOnOppiaFeedbackAvailableEventEmitter = new EventEmitter<void>();
    let isIframed = false;
    let profilePicture = 'profile_url';

    spyOn(contextService, 'isInExplorationEditorPage').and.returnValues(
      true, false);
    spyOn(urlService, 'isIframed').and.returnValue(isIframed);
    spyOn(deviceInfoService, 'isMobileDevice').and.returnValue(true);
    spyOn(audioBarStatusService, 'isAudioBarExpanded').and.returnValue(true);
    spyOn(urlInterpolationService, 'getStaticImageUrl')
      .and.returnValues('avatar_url', 'profile_url', 'default image path');
    spyOn(componentInstance, 'updateDisplayedCard');
    spyOnProperty(playerPositionService, 'onActiveCardChanged').and.returnValue(
      mockOnActiveCardChangedEventEmitter);
    spyOnProperty(explorationPlayerStateService, 'onOppiaFeedbackAvailable')
      .and.returnValue(mockOnOppiaFeedbackAvailableEventEmitter);
    spyOn(componentInstance, 'getInputResponsePairId').and.returnValue('hash');
    spyOn(userService, 'getProfileImageDataUrlAsync').and.returnValue(
      Promise.resolve(profilePicture));
    componentInstance.displayedCard = mockDisplayedCard;

    componentInstance.ngOnInit();
    componentInstance.isAudioBarExpandedOnMobileDevice();
    mockOnOppiaFeedbackAvailableEventEmitter.emit();
    mockOnActiveCardChangedEventEmitter.emit();
    tick();
    tick();

    componentInstance.ngOnInit();
    tick();
    expect(componentInstance.profilePicture).toEqual(profilePicture);

    expect(componentInstance.isIframed).toEqual(isIframed);
    expect(contextService.isInExplorationEditorPage).toHaveBeenCalled();
    expect(urlService.isIframed).toHaveBeenCalled();
    expect(deviceInfoService.isMobileDevice).toHaveBeenCalled();
    expect(audioBarStatusService.isAudioBarExpanded).toHaveBeenCalled();
    expect(urlInterpolationService.getStaticImageUrl).toHaveBeenCalled();
    expect(componentInstance.getInputResponsePairId).toHaveBeenCalled();
  }));

  it('should refresh displayed card on changes', fakeAsync(() => {
    let updateDisplayedCardSpy = spyOn(
      componentInstance, 'updateDisplayedCard');
    const changes: SimpleChanges = {
      displayedCard: {
        previousValue: false,
        currentValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    componentInstance.ngOnChanges(changes);
    expect(updateDisplayedCardSpy).toHaveBeenCalled();
  }));

  it('should update displayed card', fakeAsync(() => {
    mockDisplayedCard.markAsCompleted();
    componentInstance.displayedCard = mockDisplayedCard;
    let mockOnNewCardAvailableEventEmitter = new EventEmitter<void>();

    spyOnProperty(playerPositionService, 'onNewCardAvailable').and.returnValue(
      mockOnNewCardAvailableEventEmitter);
    spyOn(currentInteractionService, 'registerPresubmitHook')
      .and.callFake(callb => callb());
    spyOn(audioTranslationManagerService, 'clearSecondaryAudioTranslations');
    spyOn(audioTranslationManagerService, 'setContentAudioTranslations');
    spyOn(audioPlayerService, 'clear');
    spyOn(audioPreloaderService, 'clearMostRecentlyRequestedAudioFilename');
    spyOn(autogeneratedAudioPlayerService, 'cancel');

    componentInstance.ngOnInit();
    mockOnNewCardAvailableEventEmitter.emit();
    tick();

    expect(audioTranslationManagerService.clearSecondaryAudioTranslations)
      .toHaveBeenCalled();
    expect(audioTranslationManagerService.setContentAudioTranslations)
      .toHaveBeenCalled();
    expect(audioPlayerService.clear).toHaveBeenCalled();
    expect(audioPreloaderService.clearMostRecentlyRequestedAudioFilename)
      .toHaveBeenCalled();
    expect(autogeneratedAudioPlayerService.cancel).toHaveBeenCalled();
  }));

  it('should tell if audio bar is expanded on mobile device', () => {
    spyOn(deviceInfoService, 'isMobileDevice').and.returnValue(true);
    spyOn(audioBarStatusService, 'isAudioBarExpanded').and.returnValue(true);
    expect(componentInstance.isAudioBarExpandedOnMobileDevice()).toBeTrue();
  });

  it('should update displayed card', fakeAsync(() => {
    componentInstance.displayedCard = mockDisplayedCard;
    let mockOnNewCardAvailableEventEmitter = new EventEmitter<void>();
    spyOnProperty(playerPositionService, 'onNewCardAvailable').and.returnValue(
      mockOnNewCardAvailableEventEmitter);
    mockOnNewCardAvailableEventEmitter.emit();
    spyOn(currentInteractionService, 'registerPresubmitHook')
      .and.callFake(callb => callb());
    spyOn(mockDisplayedCard, 'getInteraction').and.returnValue(
      new Interaction([], [], null, null, [], '', null));
    spyOn(mockDisplayedCard, 'isCompleted').and.returnValue(true);
    spyOn(audioTranslationManagerService, 'setContentAudioTranslations');
    spyOn(audioPlayerService, 'clear');
    spyOn(audioPreloaderService, 'clearMostRecentlyRequestedAudioFilename');
    spyOn(autogeneratedAudioPlayerService, 'cancel');
  }));

  it('should get RTL language status correctly', () => {
    expect(componentInstance.isLanguageRTL()).toEqual(true);
  });

  it('should check if interaction is inline', () => {
    componentInstance.conceptCardIsBeingShown = true;
    componentInstance.displayedCard = mockDisplayedCard;
    expect(componentInstance.isInteractionInline()).toBeTrue();
    componentInstance.conceptCardIsBeingShown = false;
    spyOn(mockDisplayedCard, 'isInteractionInline').and.returnValue(false);
    componentInstance.displayedCard = mockDisplayedCard;
    expect(componentInstance.isInteractionInline()).toBeFalse();
  });

  it('should get content audio highlight class', () => {
    spyOn(audioTranslationManagerService, 'getCurrentComponentName')
      .and.returnValue(AppConstants.COMPONENT_NAME_CONTENT);
    spyOn(audioPlayerService, 'isPlaying').and.returnValue(false);
    spyOn(autogeneratedAudioPlayerService, 'isPlaying').and.returnValue(true);
    expect(componentInstance.getContentAudioHighlightClass()).toEqual(
      ExplorationPlayerConstants.AUDIO_HIGHLIGHT_CSS_CLASS);
  });

  it('should get content focus label', () => {
    expect(componentInstance.getContentFocusLabel(1)).toEqual(
      ExplorationPlayerConstants.CONTENT_FOCUS_LABEL_PREFIX + 1);
  });

  it('should toggle show previous responses', () => {
    componentInstance.arePreviousResponsesShown = false;
    componentInstance.toggleShowPreviousResponses();
    expect(componentInstance.arePreviousResponsesShown).toBeTrue();
  });

  it('should tell if window is narrow', () => {
    spyOn(windowDimensionsService, 'isWindowNarrow').and.returnValue(true);
    expect(componentInstance.isWindowNarrow()).toBeTrue();
  });

  it('should show two cards', () => {
    spyOn(windowDimensionsService, 'getWidth').and.returnValue(300);
    expect(componentInstance.canWindowShowTwoCards()).toBeFalse();
  });

  it('should tell if audio bar can be shown', () => {
    componentInstance.isIframed = false;
    spyOn(explorationPlayerStateService, 'isInQuestionMode')
      .and.returnValue(false);
    expect(componentInstance.showAudioBar()).toBeTrue();
  });

  it('should tell if content audio translation is available', () => {
    componentInstance.conceptCardIsBeingShown = true;
    componentInstance.displayedCard = mockDisplayedCard;
    expect(componentInstance.isContentAudioTranslationAvailable()).toBeFalse();
    componentInstance.conceptCardIsBeingShown = false;
    spyOn(mockDisplayedCard, 'isContentAudioTranslationAvailable')
      .and.returnValue(true);
    componentInstance.displayedCard = mockDisplayedCard;
    expect(componentInstance.isContentAudioTranslationAvailable()).toBeTrue();
  });

  it('should if current card is at end of transcript', () => {
    componentInstance.displayedCard = mockDisplayedCard;
    spyOn(mockDisplayedCard, 'isCompleted').and.returnValue(true);
    expect(componentInstance.isCurrentCardAtEndOfTranscript()).toBeFalse();
  });

  it('should tell if on a terminal card', () => {
    componentInstance.displayedCard = mockDisplayedCard;
    spyOn(mockDisplayedCard, 'isTerminal').and.returnValue(true);
    expect(componentInstance.isOnTerminalCard()).toBeTrue();
  });

  it('should get input response pair id', () => {
    expect(componentInstance.getInputResponsePairId(1)).toEqual(
      'input-response-pair-1');
  });
});
